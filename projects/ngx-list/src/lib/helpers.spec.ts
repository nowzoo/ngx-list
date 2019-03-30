import { NgxListHelpers } from './helpers';

describe('NgxListHelpers', () => {

  describe('isNullOrUndefined(value)', () => {
    it('should be true for undefined', () => {
      expect(NgxListHelpers.isNullOrUndefined(undefined)).toBe(true);
      const foo: any = {};
      const accessor = 'b';
      expect(NgxListHelpers.isNullOrUndefined(foo.b)).toBe(true);
      expect(NgxListHelpers.isNullOrUndefined(foo[accessor])).toBe(true);
    });
    it('should be true for null', () => {
      expect(NgxListHelpers.isNullOrUndefined(null)).toBe(true);
    });
    it('should be false for anything else', () => {
      expect(NgxListHelpers.isNullOrUndefined('a')).toBe(false);
    });
  });

  describe('orNull', () => {
    it('should be null for null', () => {
      expect(NgxListHelpers.orNull(null)).toBe(null);
    });
    it('should be null for undefined', () => {
      expect(NgxListHelpers.orNull(undefined)).toBe(null);
    });
    it('should be the value for anything else', () => {
      expect(NgxListHelpers.orNull('foo')).toBe('foo');
      expect(NgxListHelpers.orNull(0)).toBe(0);
    });
  });


  describe('ensureTrimmedString(val)', () => {
    it('should return an empty string if passed null', () => {
      expect(NgxListHelpers.ensureTrimmedString(null)).toBe('');
    });
    it('should return an empty string if passed undefined', () => {
      expect(NgxListHelpers.ensureTrimmedString(undefined)).toBe('');
    });
    it('should return an empty string if passed an object', () => {
      expect(NgxListHelpers.ensureTrimmedString({})).toBe('');
    });
    it('should return an empty string if passed a RegEx', () => {
      expect(NgxListHelpers.ensureTrimmedString(/\b/)).toBe('');
    });
    it('should return an empty string if passed an empty string', () => {
      expect(NgxListHelpers.ensureTrimmedString('')).toBe('');
    });
    it('should return the trimmed string', () => {
      expect(NgxListHelpers.ensureTrimmedString(' fooo  ')).toBe('fooo');
    });
  });

  describe('safeToString(val)', () => {
    it('should return an empty string if passed null', () => {
      expect(NgxListHelpers.safeToString(null)).toBe('');
    });
    it('should return an empty string if passed undefined', () => {
      expect(NgxListHelpers.safeToString(undefined)).toBe('');
    });
    it('should return a string if passed an object', () => {
      expect(NgxListHelpers.safeToString({})).toEqual(jasmine.any(String));
    });
    it('should return a string if passed a string', () => {
      expect(NgxListHelpers.safeToString('foo')).toBe('foo');
    });
    it('should return a string if passed a number', () => {
      expect(NgxListHelpers.safeToString(8.9)).toBe('8.9');
    });
    it('should return a string if passed a regexp', () => {
      expect(NgxListHelpers.safeToString(/\s+/)).toBe('/\\s+/');
    });
    it('should return a string if passed a date', () => {
      expect(NgxListHelpers.safeToString(new Date())).toEqual(jasmine.any(String));
    });
  });

  describe('get()', () => {
    it('should work in a variety of circumstances', () => {
      expect( NgxListHelpers.get({foo: {bar: [1]}}, 'foo.bar[0]')).toBe(1);
      expect( NgxListHelpers.get({foo: {bar: []}}, 'foo.bar[0]')).toBe(undefined);
      expect( NgxListHelpers.get({}, 'foo.bar[0]')).toBe(undefined);
      expect( NgxListHelpers.get({foo: {bar: [{baz: 8}]}}, 'foo.bar[0].baz')).toBe(8);
      expect( NgxListHelpers.get({foo: {bar: []}}, 'foo.bar[0].baz', 6)).toBe(6);
    });
  });

  describe('chunk', () => {
    it('should work as expected', () => {
      expect(NgxListHelpers.chunk([], 10)).toEqual([]);
      expect(NgxListHelpers.chunk(['a'], 10)).toEqual([['a']]);
      expect(NgxListHelpers.chunk(['a', 'b', 'c'], 2)).toEqual([['a', 'b'], ['c']]);
    });
  });


});
