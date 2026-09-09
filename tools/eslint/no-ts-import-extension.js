/**
 * Relative import specifiers use the `.js` extension, never `.ts`.
 *
 * Either would work: `tsconfig.build.json` sets `rewriteRelativeImportExtensions`, so `tsc` rewrites
 * `.ts` to `.js` on emit. This is a consistency rule rather than a correctness one — one convention
 * in the codebase instead of two — and `.js` is the side that was picked.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const noTsImportExtension = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce .js extension in relative import specifiers' },
    fixable: 'code',
    schema: [],
    messages: {
      sourceExtension: "Import the emitted module: use the '.js' extension, not '.ts'.",
    },
  },
  create(context) {
    /** @param {any} node - the node holding the module specifier, or null. */
    function checkSource(node) {
      // `import('./foo.ts')` in type position wraps its specifier in a `TSLiteralType`.
      const source = node?.type === 'TSLiteralType' ? node.literal : node;
      if (source?.type !== 'Literal' || typeof source.value !== 'string' || !source.value.startsWith('.')) {
        return;
      }
      if (!source.value.endsWith('.ts') || source.value.endsWith('.d.ts')) {
        return;
      }
      context.report({
        node: source,
        messageId: 'sourceExtension',
        fix(fixer) {
          // Rewrite the raw text so the original quote style survives the fix.
          const quote = source.raw.slice(-1);
          return fixer.replaceTextRange(source.range, `${source.raw.slice(0, -4)}.js${quote}`);
        },
      });
    }

    return {
      ImportDeclaration: (node) => checkSource(node.source),
      ExportNamedDeclaration: (node) => checkSource(node.source),
      ExportAllDeclaration: (node) => checkSource(node.source),
      // `await import('./foo.ts')`, and `import('./foo.ts')` in type position.
      ImportExpression: (node) => checkSource(node.source),
      TSImportType: (/** @type {any} */ node) => checkSource(node.argument),
    };
  },
};
