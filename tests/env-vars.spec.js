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
      const rawInput = 'NAME_A=AAA';
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `AAA` },
        ],
        errors: [],
      });
    });

    test('multiple vars', () => {
      const rawInput = [
        'NAME_A=AAA',
        'NAME_B=BBBB',
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: 'BBBB' },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    test('accept empty values', () => {
      const rawInput = [
        'NAME_A=AAA',
        'NAME_B=',
        'NAME_C=',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: '' },
          { name: 'NAME_C', value: '' },
        ],
        errors: [],
      });
    });

    // We don't consider these as 2 values
    test('accept space in values', () => {
      const rawInput = [
        'NAME_A=AAA',
        'NAME_B=BBBB BBBB',
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: 'BBBB BBBB' },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    test('accept simple quotes in values', () => {
      const rawInput = [
        'NAME_A=AAA',
        `NAME_B=BBBB'BBBB`,
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: `BBBB'BBBB` },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    test('accept double quotes in values', () => {
      const rawInput = [
        'NAME_A=AAA',
        `NAME_B=BBBB"BBBB`,
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: `BBBB"BBBB` },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    // We consider = as part of the value
    test('accept = in values', () => {
      const rawInput = [
        'NAME_A=AAA',
        'NAME_B=BBBB OTHER=BBBB',
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: 'BBBB OTHER=BBBB' },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    test('ignore lines starting with comments', () => {
      const rawInput = [
        'NAME_A=AAA',
        '#NAME_B=BBBB',
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    test('ignore empty lines', () => {
      const rawInput = [
        '',
        'NAME_A=AAA',
        '',
        'NAME_B=BBBB',
        'NAME_C=CCCCC',
        '',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: 'BBBB' },
          { name: 'NAME_C', value: 'CCCCC' },
        ],
        errors: [],
      });
    });

    test('line breaks must be quoted (simple)', () => {
      const rawInput = [
        `NAME_A='A\na\nA'`,
        `NAME_B=BBBB`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `A\na\nA` },
          { name: 'NAME_B', value: 'BBBB' },
        ],
        errors: [],
      });
    });

    test('line breaks must be quoted (double)', () => {
      const rawInput = [
        `NAME_A="A\na\nA"`,
        `NAME_B=BBBB`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `A\na\nA` },
          { name: 'NAME_B', value: 'BBBB' },
        ],
        errors: [],
      });
    });

    test('simple quotes must be escaped in simple quotes', () => {
      const rawInput = [
        `NAME_A='AAA'`,
        `NAME_B='BBBB \\' BBBB'`,
        `NAME_C='CCCCC \\'CCCCC\\' CCCCC'`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `AAA` },
          { name: 'NAME_B', value: `BBBB ' BBBB` },
          { name: 'NAME_C', value: `CCCCC 'CCCCC' CCCCC` },
        ],
        errors: [],
      });
    });

    test('double quotes must be escaped in double quotes', () => {
      const rawInput = [
        `NAME_A="AAA"`,
        `NAME_B="BBBB \\" BBBB"`,
        `NAME_C="CCCCC \\"CCCCC\\" CCCCC"`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `AAA` },
          { name: 'NAME_B', value: `BBBB " BBBB` },
          { name: 'NAME_C', value: `CCCCC "CCCCC" CCCCC` },
        ],
        errors: [],
      });
    });

    test('understand multiple escaping', () => {
      // \" => "
      // \\\" => \"
      // \\\\\\" => \\"
      // \\\\\\\\" => \\\"
      // ...
      const rawInput = [
        // AAA \\\" AAA
        `NAME_A="AAA \\\\\\" AAA"`,
        // BBBB \\\\\"BBBB\\\\\" BBBB
        `NAME_B="BBBB \\\\\\\\\\"BBBB\\\\\\\\\\" BBBB"`,
        // CCCCC \\\\\\\"CCCCC\\\\\\\" CCCCC
        `NAME_C="CCCCC \\\\\\\\\\\\\\"CCCCC\\\\\\\\\\\\\\" CCCCC"`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          // AAA \" AAA
          { name: 'NAME_A', value: `AAA \\\" AAA` }, // eslint-disable-line no-useless-escape
          // BBBB \\"BBBB\\" BBBB
          { name: 'NAME_B', value: `BBBB \\\\"BBBB\\\\" BBBB` },
          // CCCCC \\\"CCCCC\\\" CCCCC
          { name: 'NAME_C', value: `CCCCC \\\\\\"CCCCC\\\\\\" CCCCC` },
        ],
        errors: [],
      });
    });

    test('understand quoted slash+n as 2 different characters', () => {
      const rawInput = [
        'NAME_A="AAA\nAAA"',
        // BBBB\nBBBB
        `NAME_B="BBBB\\nBBBB"`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          // AAA
          // AAA
          { name: 'NAME_A', value: `AAA\nAAA` },
          // BBBB\nBBBB
          { name: 'NAME_B', value: `BBBB\\nBBBB` },
        ],
        errors: [],
      });
    });

    test('sort vars by name', () => {
      const rawInput = [
        'NAME_C="CCCCC"',
        'NAME_B="BBBB"',
        'NAME_D="DDDDDD"',
        'NAME_A="AAA"',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `AAA` },
          { name: 'NAME_B', value: `BBBB` },
          { name: 'NAME_C', value: `CCCCC` },
          { name: 'NAME_D', value: `DDDDDD` },
        ],
        errors: [],
      });
    });
  });

  describe('return errors', () => {

    test('invalid variable name', () => {
      const rawInput = [
        'NAME_A=AAA',
        'NAME@BBBB=BBBB',
        'NAME_C=CCCCC',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_C', value: 'CCCCC' },
          { name: 'NAME@BBBB', value: 'BBBB' },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_NAME,
          name: 'NAME@BBBB',
          pos: { line: 2, column: 0 },
        }],
      });
    });

    test('duplicated variable names', () => {
      const rawInput = [
        'NAME_A=AAA',
        'NAME_A=aaa',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_A', value: 'aaa' },
        ],
        errors: [{
          type: ERROR_TYPES.DUPLICATED_NAME,
          name: 'NAME_A',
          pos: { line: 2, column: 0 },
        }],
      });
    });

    test('line without =', () => {
      const rawInput = [
        'NAME_A=A',
        'AA',
        'NAME_B=BBBB',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'A' },
          { name: 'NAME_B', value: 'BBBB' },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_LINE,
          pos: { line: 2, column: 0 },
        }],
      });
    });

    test('simple quoted value with text after last quote', () => {
      const rawInput = [
        `NAME_A='AAA' bad text`,
        'NAME_B=BBBB',
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: 'AAA' },
          { name: 'NAME_B', value: 'BBBB' },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_VALUE,
          name: 'NAME_A',
          pos: { line: 1, column: 12 },
        }],
      });
    });

    test('no simple quote at the end', () => {
      const rawInput = [
        `NAME_A='AAA'`,
        `NAME_B='BBBB BBBB'`,
        `NAME_C='CCCCC CCCCC CCCCC`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `AAA` },
          { name: 'NAME_B', value: `BBBB BBBB` },
          { name: 'NAME_C', value: `CCCCC CCCCC CCCCC` },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_VALUE,
          name: 'NAME_C',
          pos: { line: 3, column: 25 },
        }],
      });
    });

    test('no double quote at the end', () => {
      const rawInput = [
        `NAME_A="AAA"`,
        `NAME_B="BBBB BBBB"`,
        `NAME_C="CCCCC CCCCC CCCCC`,
      ].join('\n');
      expect(parseRaw(rawInput)).toEqual({
        variables: [
          { name: 'NAME_A', value: `AAA` },
          { name: 'NAME_B', value: `BBBB BBBB` },
          { name: 'NAME_C', value: `CCCCC CCCCC CCCCC` },
        ],
        errors: [{
          type: ERROR_TYPES.INVALID_VALUE,
          name: 'NAME_C',
          pos: { line: 3, column: 25 },
        }],
      });
    });
  });
});

describe('toNameEqualsValueString()', () => {

  test('simple var', () => {
    const variables = [
      { name: 'NAME_A', value: `AAA` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      `NAME_A="AAA"`,
    ].join('\n'));
  });

  test('multiple vars', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: 'BBBB' },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      'NAME_B="BBBB"',
      'NAME_C="CCCCC"',
    ].join('\n'));
  });

  test('multiple vars (with exports)', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: 'BBBB' },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameEqualsValueString(variables, { addExports: true })).toBe([
      'export NAME_A="AAA";',
      'export NAME_B="BBBB";',
      'export NAME_C="CCCCC";',
    ].join('\n'));
  });

  test('accept empty values', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: '' },
      { name: 'NAME_C', value: '' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      'NAME_B=""',
      'NAME_C=""',
    ].join('\n'));
  });

  test('accept space in values', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: 'BBBB BBBB' },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      'NAME_B="BBBB BBBB"',
      'NAME_C="CCCCC"',
    ].join('\n'));
  });

  test('accept simple quotes in values', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: `BBBB'BBBB` },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      `NAME_B="BBBB'BBBB"`,
      'NAME_C="CCCCC"',
    ].join('\n'));
  });

  test('accept double quotes in values (and escape them)', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: `BBBB"BBBB` },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      `NAME_B="BBBB\\"BBBB"`,
      'NAME_C="CCCCC"',
    ].join('\n'));
  });

  test('accept = in values', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: 'BBBB OTHER=BBBB' },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      'NAME_B="BBBB OTHER=BBBB"',
      'NAME_C="CCCCC"',
    ].join('\n'));
  });

  test('accept line breaks', () => {
    const variables = [
      { name: 'NAME_A', value: `A\na\nA` },
      { name: 'NAME_B', value: 'BBBB' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      `NAME_A="A\na\nA"`,
      'NAME_B="BBBB"',
    ].join('\n'));
  });

  test('accept line breaks (with exports)', () => {
    const variables = [
      { name: 'NAME_A', value: `A\na\nA` },
      { name: 'NAME_B', value: 'BBBB' },
    ];
    expect(toNameEqualsValueString(variables, { addExports: true })).toBe([
      `export NAME_A="A\na\nA";`,
      'export NAME_B="BBBB";',
    ].join('\n'));
  });

  test('accept line breaks and escape double quotes', () => {
    const variables = [
      { name: 'NAME_A', value: `A\n"a"\nA` },
      { name: 'NAME_B', value: 'BBBB' },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      `NAME_A="A\n\\"a\\"\nA"`,
      'NAME_B="BBBB"',
    ].join('\n'));
  });

  test('escape double quotes', () => {
    // " => \"
    const variables = [
      { name: 'NAME_A', value: `AAA` },
      { name: 'NAME_B', value: `BBBB " BBBB` },
      { name: 'NAME_C', value: `CCCCC "CCCCC" CCCCC` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      `NAME_B="BBBB \\" BBBB"`,
      `NAME_C="CCCCC \\"CCCCC\\" CCCCC"`,
    ].join('\n'));
  });

  test('escape already escaped double quotes', () => {
    // \" => \\\"
    // \\" => \\\\\\"
    // \\\" => \\\\\\\\"
    // ...
    const variables = [
      // AAA \" AAA
      { name: 'NAME_A', value: `AAA \\\" AAA` }, // eslint-disable-line no-useless-escape
      // BBBB \\"BBBB\\" BBBB
      { name: 'NAME_B', value: `BBBB \\\\"BBBB\\\\" BBBB` },
      // CCCCC \\\"CCCCC\\\" CCCCC
      { name: 'NAME_C', value: `CCCCC \\\\\\"CCCCC\\\\\\" CCCCC` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      // AAA \\\" AAA
      `NAME_A="AAA \\\\\\" AAA"`,
      // BBBB \\\\\"BBBB\\\\\" BBBB
      `NAME_B="BBBB \\\\\\\\\\"BBBB\\\\\\\\\\" BBBB"`,
      // CCCCC \\\\\\\"CCCCC\\\\\\\" CCCCC
      `NAME_C="CCCCC \\\\\\\\\\\\\\"CCCCC\\\\\\\\\\\\\\" CCCCC"`,
    ].join('\n'));
  });

  test('not escape slash+n', () => {
    const variables = [
      // AAA
      // AAA
      { name: 'NAME_A', value: `AAA\nAAA` },
      // BBBB\nBBBB
      { name: 'NAME_B', value: `BBBB\\nBBBB` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA\nAAA"',
      // BBBB\nBBBB
      `NAME_B="BBBB\\nBBBB"`,
    ].join('\n'));
  });

  test('sort vars by name', () => {
    const variables = [
      { name: 'NAME_C', value: `CCCCC` },
      { name: 'NAME_B', value: `BBBB` },
      { name: 'NAME_D', value: `DDDDDD` },
      { name: 'NAME_A', value: `AAA` },
    ];
    expect(toNameEqualsValueString(variables)).toBe([
      'NAME_A="AAA"',
      'NAME_B="BBBB"',
      'NAME_C="CCCCC"',
      'NAME_D="DDDDDD"',
    ].join('\n'));
  });
});

describe('toNameValueObject()', () => {

  test('multiple vars', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_B', value: 'BBBB' },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameValueObject(variables)).toEqual({
      NAME_A: 'AAA',
      NAME_B: 'BBBB',
      NAME_C: 'CCCCC',
    });
  });

  test('merge ducplicated names (keep last)', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME_A', value: 'aaa' },
      { name: 'NAME_B', value: 'BBBB' },
    ];
    expect(toNameValueObject(variables)).toEqual({
      NAME_A: 'aaa',
      NAME_B: 'BBBB',
    });
  });

  test('filter invalid names', () => {
    const variables = [
      { name: 'NAME_A', value: 'AAA' },
      { name: 'NAME@BBBB', value: 'BBBB' },
      { name: 'NAME_C', value: 'CCCCC' },
    ];
    expect(toNameValueObject(variables)).toEqual({
      NAME_A: 'AAA',
      NAME_C: 'CCCCC',
    });
  });
});
