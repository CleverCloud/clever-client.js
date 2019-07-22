import {
  ERROR_TYPES,
  parseRaw,
  toNameEqualsValueString,
  toNameValueObject,
  validateName,
} from '../esm/utils/env-vars.js';

describe('validateName()', () => {

  test('OK (classic bash/linux)', () => {
    expect(validateName('FOOBAR')).toBe(true);
    expect(validateName('FOO123')).toBe(true);
    expect(validateName('FOO_BAR')).toBe(true);
  });

  test('OK (clever cloud specials)', () => {
    expect(validateName('foobar')).toBe(true);
    expect(validateName('123BAR')).toBe(true);
    expect(validateName('FOO-BAR')).toBe(true);
    expect(validateName('FOO.BAR')).toBe(true);
  });

  test('NOT OK', () => {
    expect(validateName(' FOOBAR')).toBe(false);
    expect(validateName('FOOBAR ')).toBe(false);
    expect(validateName('FOO\nBAR')).toBe(false);
    expect(validateName('FOO@BAR')).toBe(false);
    expect(validateName('FOO)BAR')).toBe(false);
    expect(validateName('FOO=BAR')).toBe(false);
  });
});

describe('parseRaw()', () => {

  describe('OK', () => {

    test('simple var', () => {
      const rawInput = 'NAME_ONE=ONE';
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `ONE` },
        ],
        errors: [],
      });
    });

    test('multiple vars', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        'NAME_TWO=TWO',
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: 'TWO' },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    test('accept empty values', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        'NAME_TWO=',
        'NAME_THREE=',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: '' },
          { name: 'NAME_THREE', value: '' },
        ],
        errors: [],
      });
    });

    // We don't consider these as 2 values
    test('accept space in values', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        'NAME_TWO=TWO TWO',
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: 'TWO TWO' },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    test('accept simple quotes in values', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        `NAME_TWO=TWO'TWO`,
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: `TWO'TWO` },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    test('accept double quotes in values', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        `NAME_TWO=TWO"TWO`,
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: `TWO"TWO` },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    // We consider = as part of the value
    test('accept = in values', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        'NAME_TWO=TWO OTHER=TWO',
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: 'TWO OTHER=TWO' },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    test('ignore lines starting with comments', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        '#NAME_TWO=TWO',
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    test('ignore empty lines', () => {
      const rawInput = [
        '',
        'NAME_ONE=ONE',
        '',
        'NAME_TWO=TWO',
        'NAME_THREE=THREE',
        '',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: 'TWO' },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [],
      });
    });

    test('line breaks must be quoted (simple)', () => {
      const rawInput = [
        `NAME_ONE='O\nN\nE'`,
        `NAME_TWO=TWO`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `O\nN\nE` },
          { name: 'NAME_TWO', value: 'TWO' },
        ],
        errors: [],
      });
    });

    test('line breaks must be quoted (double)', () => {
      const rawInput = [
        `NAME_ONE="O\nN\nE"`,
        `NAME_TWO=TWO`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `O\nN\nE` },
          { name: 'NAME_TWO', value: 'TWO' },
        ],
        errors: [],
      });
    });

    test('simple quotes must be escaped in simple quotes', () => {
      const rawInput = [
        `NAME_ONE='ONE'`,
        `NAME_TWO='TWO \\' TWO'`,
        `NAME_THREE='THREE \\'THREE\\' THREE'`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `ONE` },
          { name: 'NAME_TWO', value: `TWO ' TWO` },
          { name: 'NAME_THREE', value: `THREE 'THREE' THREE` },
        ],
        errors: [],
      });
    });

    test('double quotes must be escaped in double quotes', () => {
      const rawInput = [
        `NAME_ONE="ONE"`,
        `NAME_TWO="TWO \\" TWO"`,
        `NAME_THREE="THREE \\"THREE\\" THREE"`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `ONE` },
          { name: 'NAME_TWO', value: `TWO " TWO` },
          { name: 'NAME_THREE', value: `THREE "THREE" THREE` },
        ],
        errors: [],
      });
    });
  });

  describe('return errors', () => {

    test('invalid variable name', () => {
      const rawInput = [
        'NAME_ONE=ONE',
        'NAME@TWO=TWO',
        'NAME_THREE=THREE',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME@TWO', value: 'TWO' },
          { name: 'NAME_THREE', value: 'THREE' },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_NAME,
          name: 'NAME@TWO',
          pos: { line: 2, column: 0 },
        }],
      });
    });

    test('duplicated variable names', () => {
      const rawInput = [
        'NAME_ONE=FIRST',
        'NAME_ONE=LAST',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'FIRST' },
          { name: 'NAME_ONE', value: 'LAST' },
        ],
        errors: [{
          type: ERROR_TYPES.DUPLICATED_NAME,
          name: 'NAME_ONE',
          pos: { line: 2, column: 0 },
        }],
      });
    });

    test('line without =', () => {
      const rawInput = [
        'NAME_ONE=O',
        'NE',
        'NAME_TWO=TWO',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'O' },
          { name: 'NAME_TWO', value: 'TWO' },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_LINE,
          pos: { line: 2, column: 0 },
        }],
      });
    });

    test('simple quoted value with text after last quote', () => {
      const rawInput = [
        `NAME_ONE='ONE' bad text`,
        'NAME_TWO=TWO',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: 'ONE' },
          { name: 'NAME_TWO', value: 'TWO' },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_VALUE,
          name: 'NAME_ONE',
          pos: { line: 1, column: 14 },
        }],
      });
    });

    test('no simple quote at the end', () => {
      const rawInput = [
        `NAME_ONE='ONE'`,
        `NAME_TWO='TWO TWO'`,
        `NAME_THREE='THREE THREE THREE`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `ONE` },
          { name: 'NAME_TWO', value: `TWO TWO` },
          { name: 'NAME_THREE', value: `THREE THREE THREE` },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_VALUE,
          name: 'NAME_THREE',
          pos: { line: 3, column: 29 },
        }],
      });
    });

    test('no double quote at the end', () => {
      const rawInput = [
        `NAME_ONE="ONE"`,
        `NAME_TWO="TWO TWO"`,
        `NAME_THREE="THREE THREE THREE`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_ONE', value: `ONE` },
          { name: 'NAME_TWO', value: `TWO TWO` },
          { name: 'NAME_THREE', value: `THREE THREE THREE` },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_VALUE,
          name: 'NAME_THREE',
          pos: { line: 3, column: 29 },
        }],
      });
    });
  });
});

describe('toNameEqualsValueString()', () => {

  test('simple var', () => {
    const variables = [
      { name: 'NAME_ONE', value: `ONE` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      `NAME_ONE="ONE"`,
    ].join('\n'));
  });

  test('multiple vars', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: 'TWO' },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      'NAME_TWO="TWO"',
      'NAME_THREE="THREE"',
    ].join('\n'));
  });

  test('multiple vars (with exports)', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: 'TWO' },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameEqualsValueString(variables, { addExports: true })).toBe([
      'export NAME_ONE="ONE";',
      'export NAME_TWO="TWO";',
      'export NAME_THREE="THREE";',
    ].join('\n'));
  });

  test('accept empty values', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: '' },
      { name: 'NAME_THREE', value: '' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      'NAME_TWO=""',
      'NAME_THREE=""',
    ].join('\n'));
  });

  test('accept space in values', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: 'TWO TWO' },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      'NAME_TWO="TWO TWO"',
      'NAME_THREE="THREE"',
    ].join('\n'));
  });

  test('accept simple quotes in values', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: `TWO'TWO` },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      `NAME_TWO="TWO'TWO"`,
      'NAME_THREE="THREE"',
    ].join('\n'));
  });

  test('accept double quotes in values', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: `TWO"TWO` },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      `NAME_TWO="TWO\\"TWO"`,
      'NAME_THREE="THREE"',
    ].join('\n'));
  });

  test('accept = in values', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: 'TWO OTHER=TWO' },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      'NAME_TWO="TWO OTHER=TWO"',
      'NAME_THREE="THREE"',
    ].join('\n'));
  });

  test('escape line breaks', () => {
    const variables = [
      { name: 'NAME_ONE', value: `O\nN\nE` },
      { name: 'NAME_TWO', value: 'TWO' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      `NAME_ONE="O\nN\nE"`,
      'NAME_TWO="TWO"',
    ].join('\n'));
  });

  test('escape line breaks (with exports)', () => {
    const variables = [
      { name: 'NAME_ONE', value: `O\nN\nE` },
      { name: 'NAME_TWO', value: 'TWO' },
    ];
    expect(toNameEqualsValueString(variables, { addExports: true })).toBe([
      `export NAME_ONE="O\nN\nE";`,
      'export NAME_TWO="TWO";',
    ].join('\n'));
  });

  test('escape line breaks and escape double quotes', () => {
    const variables = [
      { name: 'NAME_ONE', value: `O\n"N"\nE` },
      { name: 'NAME_TWO', value: 'TWO' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      `NAME_ONE="O\n\\"N\\"\nE"`,
      'NAME_TWO="TWO"',
    ].join('\n'));
  });

  test('escape double quotes', () => {
    const variables = [
      { name: 'NAME_ONE', value: `ONE` },
      { name: 'NAME_TWO', value: `TWO " TWO` },
      { name: 'NAME_THREE', value: `THREE "THREE" THREE` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_ONE="ONE"',
      `NAME_TWO="TWO \\" TWO"`,
      `NAME_THREE="THREE \\"THREE\\" THREE"`,
    ].join('\n'));
  });
});

describe('toNameValueObject()', () => {

  test('multiple vars', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME_TWO', value: 'TWO' },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameValueObject(variables)).toEqual({
      NAME_ONE: 'ONE',
      NAME_TWO: 'TWO',
      NAME_THREE: 'THREE',
    });
  });

  test('merge ducplicated names (keep last)', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'FIRST' },
      { name: 'NAME_ONE', value: 'LAST' },
      { name: 'NAME_TWO', value: 'TWO' },
    ];
    expect(toNameValueObject(variables)).toEqual({
      NAME_ONE: 'LAST',
      NAME_TWO: 'TWO',
    });
  });

  test('filter invalid names', () => {
    const variables = [
      { name: 'NAME_ONE', value: 'ONE' },
      { name: 'NAME@TWO', value: 'TWO' },
      { name: 'NAME_THREE', value: 'THREE' },
    ];
    expect(toNameValueObject(variables)).toEqual({
      NAME_ONE: 'ONE',
      NAME_THREE: 'THREE',
    });
  });
});
