import { RuleTester } from 'oxlint/plugins-dev';
import { describe, it } from 'vitest';
import { classMemberPrivacy } from '../../../../tasks/oxlint-plugin/class-member-privacy.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } });

const missingPrefix = (name: string, accessibility = 'private') => ({
  messageId: 'missingPrefix',
  data: { accessibility, name },
});
const unexpectedPrefix = (name: string) => ({ messageId: 'unexpectedPrefix', data: { name } });
const hashPrivate = (name: string) => ({ messageId: 'hashPrivate', data: { name } });

ruleTester.run('class-member-privacy', classMemberPrivacy, {
  valid: [
    'class Foo { private _bar = 1; private _baz() {} private get _qux() { return 1; } }',
    'class Foo { private static readonly _bar = 1; }',
    'class Foo { bar = 1; baz() {} public quux = 1; }',
    'class Foo { protected readonly _bar = 1; protected _baz() {} protected static _qux = 1; }',
    'class Foo extends Bar { protected override render() {} public override _baz() {} override qux = 1; }',
    'class Foo extends Bar { constructor(protected override bar: number) { super(); } }',
    'class Foo { private constructor() {} }',
    'class Foo { constructor(private readonly _bar: number, protected _baz: number, public qux = 1) {} }',
    'const _bar = "bar"; class Foo { [_bar] = 1; private [_bar + "baz"] = 1; }',
    'class Foo { "_bar" = 1; }',
    'abstract class Foo { protected abstract _bar(): void; }',
  ],
  invalid: [
    // Detection

    {
      code: 'class Foo { private get bar() { return 1; } }',
      output: 'class Foo { private get _bar() { return 1; } }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private accessor bar = 1; }',
      output: 'class Foo { private accessor _bar = 1; }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { protected bar() {} }',
      output: null,
      errors: [missingPrefix('bar', 'protected')],
    },
    {
      code: 'class Foo { protected readonly bar = 1; }',
      output: null,
      errors: [missingPrefix('bar', 'protected')],
    },
    {
      code: 'class Foo { constructor(protected bar: number) {} }',
      output: null,
      errors: [missingPrefix('bar', 'protected')],
    },
    {
      code: 'abstract class Foo { protected abstract bar(): void; }',
      output: null,
      errors: [missingPrefix('bar', 'protected')],
    },
    {
      code: 'class Foo { _bar = 1; }',
      output: null,
      errors: [unexpectedPrefix('_bar')],
    },
    {
      code: 'class Foo { public _bar = 1; }',
      output: null,
      errors: [unexpectedPrefix('_bar')],
    },
    {
      code: 'class Foo { constructor(public _bar: number) {} }',
      output: null,
      errors: [unexpectedPrefix('_bar')],
    },
    {
      code: 'abstract class Foo { abstract _bar(): void; }',
      output: null,
      errors: [unexpectedPrefix('_bar')],
    },

    // Fix of `#` members

    {
      code: 'class Foo { #bar = 1; baz(other: Foo) { return this.#bar + other.#bar + (#bar in other ? 1 : 0); } }',
      output:
        'class Foo { private _bar = 1; baz(other: Foo) { return this._bar + other._bar + (_bar in other ? 1 : 0); } }',
      errors: [hashPrivate('bar')],
    },
    {
      code: 'class Foo { static readonly #bar = 1; async #baz() { return Foo.#bar; } }',
      output: 'class Foo { private static readonly _bar = 1; private async _baz() { return Foo._bar; } }',
      errors: [hashPrivate('bar'), hashPrivate('baz')],
    },
    {
      code: 'class Foo { get #bar() { return 1; } set #bar(value) {} baz() { this.#bar = this.#bar; } }',
      output:
        'class Foo { private get _bar() { return 1; } private set _bar(value) {} baz() { this._bar = this._bar; } }',
      errors: [hashPrivate('bar'), hashPrivate('bar')],
    },
    {
      code: 'class Foo { @dec() #bar = 1; }',
      output: 'class Foo { @dec() private _bar = 1; }',
      errors: [hashPrivate('bar')],
    },
    {
      code: 'class Foo { #bar = 1; baz() { return class { #bar = 2; _bar = 3; qux() { return this.#bar; } }; } }',
      output:
        'class Foo { private _bar = 1; baz() { return class { #bar = 2; _bar = 3; qux() { return this.#bar; } }; } }',
      errors: [hashPrivate('bar'), hashPrivate('bar'), unexpectedPrefix('_bar')],
    },
    {
      code: 'class Foo { #bar = 1; #baz = 2; private _bar = 3; qux() { return this.#bar + this.#baz; } }',
      output: 'class Foo { #bar = 1; private _baz = 2; private _bar = 3; qux() { return this.#bar + this._baz; } }',
      errors: [hashPrivate('bar'), hashPrivate('baz')],
    },
    {
      code: 'class Foo { #bar = 1; private _bar = 2; }',
      output: null,
      errors: [hashPrivate('bar')],
    },

    // Fix of `private` members

    {
      code: 'class Foo { private bar: number = 1; baz() { return this.bar + (() => this.bar)(); } }',
      output: 'class Foo { private _bar: number = 1; baz() { return this._bar + (() => this._bar)(); } }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar() {} baz = () => this.bar(); }',
      output: 'class Foo { private _bar() {} baz = () => this._bar(); }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private static bar = 1; static baz() { return this.bar; } static { this.bar = 2; } }',
      output: 'class Foo { private static _bar = 1; static baz() { return this._bar; } static { this._bar = 2; } }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar = 1; private static bar = 2; baz() { return this.bar; } static qux() { return this.bar; } }',
      output:
        'class Foo { private _bar = 1; private static _bar = 2; baz() { return this._bar; } static qux() { return this._bar; } }',
      errors: [missingPrefix('bar'), missingPrefix('bar')],
    },
    {
      code: 'class Foo { private get bar() { return 1; } private set bar(value) {} baz() { this.bar = this.bar; } }',
      output:
        'class Foo { private get _bar() { return 1; } private set _bar(value) {} baz() { this._bar = this._bar; } }',
      errors: [missingPrefix('bar'), missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar = 1; baz(bar: number, other: { bar: number }) { return bar + other.bar; } }',
      output: 'class Foo { private _bar = 1; baz(bar: number, other: { bar: number }) { return bar + other.bar; } }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { constructor(private readonly bar: number) { console.log(bar, { bar }, this.bar); } }',
      output:
        'class Foo { constructor(private readonly _bar: number) { console.log(_bar, { bar: _bar }, this._bar); } }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { constructor(private bar = 1) {} baz() { return this.bar; } }',
      output: 'class Foo { constructor(private _bar = 1) {} baz() { return this._bar; } }',
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar = 1; private _bar = 2; }',
      output: null,
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar = 1; baz() { return function () { return this.bar; }; } }',
      output: null,
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar = 1; baz() { return class { qux() { return this.bar; } }; } }',
      output: null,
      errors: [missingPrefix('bar')],
    },
    {
      code: "class Foo { private bar = 1; baz(other: Foo) { return other['bar']; } }",
      output: null,
      errors: [missingPrefix('bar')],
    },
    {
      code: 'class Foo { private bar = 1; baz() { const { bar } = this; return bar; } }',
      output: null,
      errors: [missingPrefix('bar')],
    },
  ],
});
