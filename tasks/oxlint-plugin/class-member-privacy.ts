import type { RuleTester } from 'oxlint/plugins-dev';

type Rule = Parameters<RuleTester['run']>[1];
type Context = Parameters<NonNullable<Rule['create']>>[0];
type Fixer = Parameters<NonNullable<Parameters<Context['report']>[0]['fix']>>[0];
type Fix = ReturnType<Fixer['replaceTextRange']>;
type Visitor = ReturnType<NonNullable<Rule['create']>>;
type NodeOf<K extends keyof Visitor> = Parameters<NonNullable<Visitor[K]>>[0];
type ClassBody = NodeOf<'ClassBody'>;
type ClassMember = NodeOf<
  | 'AccessorProperty'
  | 'MethodDefinition'
  | 'PropertyDefinition'
  | 'TSAbstractAccessorProperty'
  | 'TSAbstractMethodDefinition'
  | 'TSAbstractPropertyDefinition'
>;
type ParameterProperty = NodeOf<'TSParameterProperty'>;

/** Any node of the tree, as walked through its visitor keys. */
interface AnyNode {
  type: string;
  range: [number, number];
  [key: string]: unknown;
}

/** What `this` refers to at a point of a class body: its instance, the class itself, or something else. */
type ThisKind = 'instance' | 'static' | null;

/** A member declaration checked by the rule, with the node it is reported on. */
interface Declaration {
  node: ClassMember | ParameterProperty;
  key: { type: string; name: string; range: [number, number] };
  isPrivateName: boolean;
  accessibility: ClassMember['accessibility'];
  isStatic: boolean;
}

const MEMBER_TYPES = new Set([
  'AccessorProperty',
  'MethodDefinition',
  'PropertyDefinition',
  'TSAbstractAccessorProperty',
  'TSAbstractMethodDefinition',
  'TSAbstractPropertyDefinition',
]);

/**
 * Class members follow one convention: the name of a `private` or `protected` member starts with `_`, the name of a
 * public member does not, and native `#` private members are not used. An `override` member keeps the name declared
 * by its base class, so it is not checked.
 *
 * The fix turns `#x` into `private _x`, and renames a `private x` member to `_x` along with its accesses through
 * `this` in the class. It is not offered when `_x` already exists, or when the class accesses the member in a way
 * the rule cannot follow. Accesses to a `private` member from another instance (`other.x`) are not renamed: the
 * typecheck reports them.
 */
export const classMemberPrivacy = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce a `_` prefix on `private` and `protected` class members only, and forbid `#` members',
    },
    messages: {
      hashPrivate: 'Use the `private` modifier with a `_` prefix instead of `#{{name}}`.',
      missingPrefix: 'Prefix the {{accessibility}} member `{{name}}` with `_`.',
      unexpectedPrefix: 'Declare `{{name}}` as `private` or `protected`, or remove its `_` prefix.',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const visitorKeys = sourceCode.visitorKeys;

    /** Calls `enter` on `node` and its descendants, skipping the descendants of a node for which it returns `false`. */
    const walk = (node: AnyNode, enter: (node: AnyNode, parent: AnyNode | null) => boolean | void): void => {
      const visit = (current: AnyNode, parent: AnyNode | null): void => {
        if (enter(current, parent) === false) {
          return;
        }
        for (const key of visitorKeys[current.type] ?? []) {
          const child = current[key];
          for (const item of Array.isArray(child) ? child : [child]) {
            if (isNode(item)) {
              visit(item, current);
            }
          }
        }
      };
      visit(node, null);
    };

    const declarationsOf = (body: ClassBody): Array<Declaration> => {
      const declarations: Array<Declaration> = [];
      for (const member of body.body) {
        if (!MEMBER_TYPES.has(member.type)) {
          continue;
        }
        const node = member as ClassMember;
        if (node.computed || node.override === true) {
          continue;
        }
        if ('kind' in node && node.kind === 'constructor') {
          for (const param of node.value.params) {
            if (param.type !== 'TSParameterProperty' || param.override) {
              continue;
            }
            const binding = param.parameter.type === 'AssignmentPattern' ? param.parameter.left : param.parameter;
            if (binding.type === 'Identifier') {
              declarations.push({
                node: param,
                key: binding,
                isPrivateName: false,
                accessibility: param.accessibility,
                isStatic: false,
              });
            }
          }
          continue;
        }
        if (node.key.type === 'Identifier' || node.key.type === 'PrivateIdentifier') {
          declarations.push({
            node,
            key: node.key,
            isPrivateName: node.key.type === 'PrivateIdentifier',
            accessibility: node.accessibility,
            isStatic: node.static,
          });
        }
      }
      return declarations;
    };

    /** Range of the first `name.length` characters of `node`: its name, without a type annotation. */
    const nameRange = (node: { range: [number, number] }, name: string): [number, number] => [
      node.range[0],
      node.range[0] + name.length,
    ];

    /** Fixes renaming the `#name` members of `body`, or `null` if they cannot be renamed. */
    const fixHashPrivate = (
      fixer: Fixer,
      body: ClassBody,
      group: Array<Declaration>,
      takenNames: Set<string>,
    ): Array<Fix> | null => {
      const name = group[0].key.name;
      const renamed = `_${name}`;
      if (takenNames.has(renamed)) {
        return null;
      }
      const fixes: Array<Fix> = [];
      walk(body as unknown as AnyNode, (node) => {
        if (node !== (body as unknown) && node.type === 'ClassBody' && declaresHashName(node, name)) {
          return false;
        }
        if (node.type === 'PrivateIdentifier' && node.name === name) {
          fixes.push(fixer.replaceText(node, renamed));
        }
      });
      for (const { node } of group) {
        const decorators = node.decorators;
        const first =
          decorators.length > 0 ? sourceCode.getTokenAfter(decorators.at(-1)!) : sourceCode.getFirstToken(node);
        if (first === null) {
          return null;
        }
        fixes.push(fixer.insertTextBefore(first, 'private '));
      }
      return fixes;
    };

    /** Fixes renaming the `private name` members of `body`, or `null` if they cannot be renamed. */
    const fixPrivate = (
      fixer: Fixer,
      body: ClassBody,
      group: Array<Declaration>,
      takenNames: Set<string>,
    ): Array<Fix> | null => {
      const { name } = group[0].key;
      const isStatic = group[0].isStatic;
      const renamed = `_${name}`;
      if (takenNames.has(renamed)) {
        return null;
      }
      const ranges = new Map<number, Fix>();
      const rename = (node: { range: [number, number] }): void => {
        ranges.set(node.range[0], fixer.replaceTextRange(nameRange(node, name), renamed));
      };
      for (const { key } of group) {
        rename(key);
      }

      const members = new Set<unknown>(body.body);
      const thisKinds = new Map<AnyNode, ThisKind>();
      let followed = true;
      walk(body as unknown as AnyNode, (node, parent) => {
        if (!followed) {
          return false;
        }
        let thisKind: ThisKind = parent === null ? null : (thisKinds.get(parent) ?? null);
        if (node.type === 'StaticBlock') {
          thisKind = 'static';
        } else if (members.has(node)) {
          thisKind = node.static === true ? 'static' : 'instance';
        } else if (
          node.type === 'FunctionExpression' ||
          node.type === 'FunctionDeclaration' ||
          node.type === 'ClassBody'
        ) {
          const isMemberValue = parent !== null && members.has(parent) && parent.value === node;
          thisKind = isMemberValue ? thisKind : null;
        }
        thisKinds.set(node, thisKind);

        if (node.type === 'MemberExpression') {
          const property = node.property as AnyNode;
          const object = node.object as AnyNode;
          if (node.computed === true) {
            if (property.type === 'Literal' && property.value === name) {
              followed = false;
            }
          } else if (property.type === 'Identifier' && property.name === name && object.type === 'ThisExpression') {
            if (thisKind === (isStatic ? 'static' : 'instance')) {
              rename(property);
            } else if (thisKind === null) {
              followed = false;
            }
          }
        } else if (node.type === 'ObjectPattern') {
          const keys = (node.properties as Array<AnyNode>).map((property) => property.key as AnyNode | undefined);
          if (keys.some((key) => key?.type === 'Identifier' && key.name === name)) {
            followed = false;
          }
        }
      });
      if (!followed) {
        return null;
      }

      for (const { node } of group) {
        if (node.type !== 'TSParameterProperty') {
          continue;
        }
        const constructor = node.parent;
        const variable = sourceCode.getDeclaredVariables(constructor).find((candidate) => candidate.name === name);
        if (variable === undefined) {
          return null;
        }
        for (const { identifier } of variable.references) {
          const parent = identifier.parent as unknown as AnyNode;
          if (parent.type === 'Property' && parent.shorthand === true) {
            ranges.set(identifier.range[0], fixer.replaceText(identifier, `${name}: ${renamed}`));
          } else {
            rename(identifier);
          }
        }
      }
      return [...ranges.values()];
    };

    return {
      ClassBody(body: ClassBody): void {
        const declarations = declarationsOf(body);
        const takenNames = new Set(declarations.filter((d) => !d.isPrivateName).map((d) => d.key.name));

        const fixGroups = new Map<string, Array<Declaration>>();
        for (const declaration of declarations) {
          const { key, accessibility, isPrivateName, isStatic } = declaration;
          const groupKey = isPrivateName
            ? `#${key.name}`
            : accessibility === 'private' && !key.name.startsWith('_')
              ? `${isStatic ? 'static' : 'instance'} ${key.name}`
              : undefined;
          if (groupKey !== undefined) {
            fixGroups.set(groupKey, [...(fixGroups.get(groupKey) ?? []), declaration]);
          }
        }

        // One fix renames every member of the class, so that a single pass applies all of them
        const fixClass = (fixer: Fixer): Array<Fix> | null => {
          const fixes = [...fixGroups.values()].flatMap(
            (group) =>
              (group[0].isPrivateName
                ? fixHashPrivate(fixer, body, group, takenNames)
                : fixPrivate(fixer, body, group, takenNames)) ?? [],
          );
          return fixes.length > 0 ? fixes : null;
        };
        const fixed = [...fixGroups.values()][0]?.[0];

        for (const declaration of declarations) {
          const { node, key, accessibility, isPrivateName } = declaration;
          const fix = declaration === fixed ? fixClass : undefined;
          const prefixed = key.name.startsWith('_');
          if (isPrivateName) {
            context.report({ node, messageId: 'hashPrivate', data: { name: key.name }, fix });
          } else if ((accessibility === 'private' || accessibility === 'protected') && !prefixed) {
            context.report({ node, messageId: 'missingPrefix', data: { accessibility, name: key.name }, fix });
          } else if (accessibility !== 'private' && accessibility !== 'protected' && prefixed) {
            context.report({ node, messageId: 'unexpectedPrefix', data: { name: key.name } });
          }
        }
      },
    };
  },
} satisfies Rule;

function isNode(value: unknown): value is AnyNode {
  return typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string';
}

/** Whether the class body `node` declares a `#name` member. */
function declaresHashName(node: AnyNode, name: string): boolean {
  return (node.body as Array<AnyNode>).some((member) => {
    const key = member.key as AnyNode | undefined;
    return key?.type === 'PrivateIdentifier' && key.name === name;
  });
}
