import { toMicroIsoString, toMicroTimestamp } from '../esm/utils/date.js';

describe('date#toMicroIsoString()', () => {

  test('from timestamp without microseconds precision', () => {
    const date = new Date('2020-03-11T11:11:11.111Z');
    const milliTimestamp = date.getTime();
    const microTimestamp = milliTimestamp * 1000;
    const isoWithMicroseconds = toMicroIsoString(microTimestamp);
    expect(isoWithMicroseconds).toBe('2020-03-11T11:11:11.111000Z');
  });

  test('from timestamp with microseconds precision', () => {
    const date = new Date('2020-03-11T11:11:11.111Z');
    const milliTimestamp = date.getTime();
    const microTimestamp = milliTimestamp * 1000 + 345;
    const isoWithMicroseconds = toMicroIsoString(microTimestamp);
    expect(isoWithMicroseconds).toBe('2020-03-11T11:11:11.111345Z');
  });
});

describe('date#toMicroTimestamp()', () => {

  test('from round micro ISO string', () => {
    const microTimestamp = toMicroTimestamp('2020-03-11T11:11:11.111000Z');
    const milliTimestamp = (new Date('2020-03-11T11:11:11.111Z')).getTime();
    expect(microTimestamp).toBe(milliTimestamp * 1000);
  });

  test('from precise micro ISO string', () => {
    const microTimestamp = toMicroTimestamp('2020-03-11T11:11:11.111345Z');
    const milliTimestamp = (new Date('2020-03-11T11:11:11.111Z')).getTime();
    expect(microTimestamp).toBe(milliTimestamp * 1000 + 345);
  });

  test('from milli ISO string', () => {
    const microTimestamp = toMicroTimestamp('2020-03-11T11:11:11.111Z');
    const milliTimestamp = (new Date('2020-03-11T11:11:11.111Z')).getTime();
    expect(microTimestamp).toBe(milliTimestamp * 1000);
  });
});
