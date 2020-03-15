import { checkCoordinates } from '../src/js/checkCoordinates';

describe('correct coordinates', () => {
  test('1', () => {
    expect(checkCoordinates('51.50851, -0.12572')).toEqual(['51.50851', '-0.12572']);
  });
  test('2', () => {
    expect(checkCoordinates('51.50851,-0.12572')).toEqual(['51.50851', '-0.12572']);
  });
  test('3', () => {
    expect(checkCoordinates('[51.50851,-0.12572]')).toEqual(['51.50851', '-0.12572']);
  });
});


describe('wrong coordinates', () => {
  test('1', () => {
    expect(() => { checkCoordinates('51, 5'); }).toThrow();
  });
  test('2', () => {
    expect(() => { checkCoordinates('qwerty'); }).toThrow();
  });
  test('3', () => {
    expect(() => { checkCoordinates('51.50851,-0.12572, 5.4759'); }).toThrow();
  });
  test('4', () => {
    expect(() => { checkCoordinates('51.50851, -0.125d72'); }).toThrow();
  });
});
