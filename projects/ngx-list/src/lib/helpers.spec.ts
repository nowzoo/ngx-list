import { Helpers } from './helpers';

describe('Helpers', () => {

  describe('isNullOrUndefined(value)', () => {
    it('should be true for undefined', () => {
      expect(Helpers.isNullOrUndefined(undefined)).toBe(true);
      const foo: any = {};
      const accessor = 'b';
      expect(Helpers.isNullOrUndefined(foo.b)).toBe(true);
      expect(Helpers.isNullOrUndefined(foo[accessor])).toBe(true);
    });
    it('should be true for null', () => {
      expect(Helpers.isNullOrUndefined(null)).toBe(true);
    });
    it('should be false for anything else', () => {
      expect(Helpers.isNullOrUndefined('a')).toBe(false);
    });
  });

  describe('orNull', () => {
    it('should be null for null', () => {
      expect(Helpers.orNull(null)).toBe(null);
    });
    it('should be null for undefined', () => {
      expect(Helpers.orNull(undefined)).toBe(null);
    });
    it('should be the value for anything else', () => {
      expect(Helpers.orNull('foo')).toBe('foo');
      expect(Helpers.orNull(0)).toBe(0);
    });
  });


  describe('ensureTrimmedString(val)', () => {
    it('should return an empty string if passed null', () => {
      expect(Helpers.ensureTrimmedString(null)).toBe('');
    });
    it('should return an empty string if passed undefined', () => {
      expect(Helpers.ensureTrimmedString(undefined)).toBe('');
    });
    it('should return an empty string if passed an object', () => {
      expect(Helpers.ensureTrimmedString({})).toBe('');
    });
    it('should return an empty string if passed a RegEx', () => {
      expect(Helpers.ensureTrimmedString(/\b/)).toBe('');
    });
    it('should return an empty string if passed an empty string', () => {
      expect(Helpers.ensureTrimmedString('')).toBe('');
    });
    it('should return the trimmed string', () => {
      expect(Helpers.ensureTrimmedString(' fooo  ')).toBe('fooo');
    });
  });

  describe('safeToString(val)', () => {
    it('should return an empty string if passed null', () => {
      expect(Helpers.safeToString(null)).toBe('');
    });
    it('should return an empty string if passed undefined', () => {
      expect(Helpers.safeToString(undefined)).toBe('');
    });
    it('should return a string if passed an object', () => {
      expect(Helpers.safeToString({})).toEqual(jasmine.any(String));
    });
    it('should return a string if passed a string', () => {
      expect(Helpers.safeToString('foo')).toBe('foo');
    });
    it('should return a string if passed a number', () => {
      expect(Helpers.safeToString(8.9)).toBe('8.9');
    });
    it('should return a string if passed a regexp', () => {
      expect(Helpers.safeToString(/\s+/)).toBe('/\\s+/');
    });
    it('should return a string if passed a date', () => {
      expect(Helpers.safeToString(new Date())).toEqual(jasmine.any(String));
    });
  });

  describe('get()', () => {
    it('should work in a variety of circumstances', () => {
      expect( Helpers.get({foo: {bar: [1]}}, 'foo.bar[0]')).toBe(1);
      expect( Helpers.get({foo: {bar: []}}, 'foo.bar[0]')).toBe(undefined);
      expect( Helpers.get({}, 'foo.bar[0]')).toBe(undefined);
      expect( Helpers.get({foo: {bar: [{baz: 8}]}}, 'foo.bar[0].baz')).toBe(8);
      expect( Helpers.get({foo: {bar: []}}, 'foo.bar[0].baz', 6)).toBe(6);
    });
  });

  describe('chunk', () => {
    it('should work as expected', () => {
      expect(Helpers.chunk([], 10)).toEqual([]);
      expect(Helpers.chunk(['a'], 10)).toEqual([['a']]);
      expect(Helpers.chunk(['a', 'b', 'c'], 2)).toEqual([['a', 'b'], ['c']]);
    });
  });


});
