import { NgxListFilters } from './filters';
import {
  NgxListFilterFn,
  NgxListFilterParams,
  NgxListColumnValueFn,
  NgxListRecord,
  NgxListCompare,
  NgxListSearchFilterOptions
} from './shared';


describe('NgxListFilters', () => {
  describe('ignoreFilterWhen(value)', () => {
    it('should return true when passed undefined', () => {
      expect(NgxListFilters.ignoreFilterWhen(undefined)).toBe(true);
    });
    it('should return true when passed null', () => {
      expect(NgxListFilters.ignoreFilterWhen(null)).toBe(true);
    });
    it('should return true when passed an empty string', () => {
      expect(NgxListFilters.ignoreFilterWhen('')).toBe(true);
    });
    it('should return true when passed a string with only whitespace', () => {
      expect(NgxListFilters.ignoreFilterWhen('   ')).toBe(true);
    });
    it('should return false for a non-empty string', () => {
        expect(NgxListFilters.ignoreFilterWhen('foo')).toBe(false);
    });
    it('should return false for an object', () => {
        expect(NgxListFilters.ignoreFilterWhen({})).toBe(false);
    });
    it('should return false for a number 0', () => {
        expect(NgxListFilters.ignoreFilterWhen(0)).toBe(false);
    });
    it('should return false for a string "0"', () => {
        expect(NgxListFilters.ignoreFilterWhen('0')).toBe(false);
    });
  });
  describe('searchFilter(options)', () => {
    it('should return a function', () => {
      const fn = NgxListFilters.searchFilter({filterKey: 'search'});
      expect(fn).toEqual(jasmine.any(Function));
    });
    it('should match case-insensitively by default', () => {
      const records = [{a: 'foo'}, {a: 'Foo'}];
      const fn = NgxListFilters.searchFilter({filterKey: 'search'});
      expect(fn(records, {search: 'foo'}).length).toBe(2);
      expect(fn(records, {search: 'Foo'}).length).toBe(2);
      expect(fn(records, {search: 'FoO'}).length).toBe(2);
    });
    it('should match case-sensitively if caseSensitive', () => {
      const records = [{a: 'foo'}, {a: 'Foo'}];
      const fn = NgxListFilters.searchFilter({filterKey: 'search', caseSensitive: true});
      expect(fn(records, {search: 'foo'}).length).toBe(1);
      expect(fn(records, {search: 'Foo'}).length).toBe(1);
      expect(fn(records, {search: 'FoO'}).length).toBe(0);
    });
    it('should ignore keys if specified', () => {
      const records = [{a: 'foo', b: 'xyz', c: {}}, {a: 'bar',  b: 'abc', c: {}}];
      const fn = NgxListFilters.searchFilter({filterKey: 'search', ignoreKeys: ['b', 'c']});
      expect(fn(records, {search: 'xyz'}).length).toBe(0);
      expect(fn(records, {search: 'abc'}).length).toBe(0);
      expect(fn(records, {search: 'object'}).length).toBe(0);
      expect(fn(records, {search: 'foo'}).length).toBe(1);
      expect(fn(records, {search: 'bar'}).length).toBe(1);
      // without ignore keys...
      const fnB =  NgxListFilters.searchFilter({filterKey: 'search', ignoreKeys: []});
      expect(fnB(records, {search: 'xyz'}).length).toBe(1);
      expect(fnB(records, {search: 'abc'}).length).toBe(1);
      expect(fnB(records, {search: 'foo'}).length).toBe(1);
      expect(fnB(records, {search: 'bar'}).length).toBe(1);
      expect(fnB(records, {search: 'object'}).length).toBe(2);
    });
    it('should inspect nested keys if specified in inspectKeys', () => {
      const records = [{a: {b: {c: 'foo', d: 8}}}, {a: {b: {c: 'bar', d: 9}}}];
      const fn = NgxListFilters.searchFilter({filterKey: 'search', inspectKeys: ['a.b.c', 'a.b.d']});
      expect(fn(records, {search: 'foo'}).length).toBe(1);
      expect(fn(records, {search: '8'}).length).toBe(1);
      expect(fn(records, {search: 'bar'}).length).toBe(1);
      expect(fn(records, {search: '9'}).length).toBe(1);
      // without inspect keys...
      const fnB = NgxListFilters.searchFilter({filterKey: 'search', inspectKeys: []});
      expect(fnB(records, {search: 'foo'}).length).toBe(0);
      expect(fnB(records, {search: '8'}).length).toBe(0);
      expect(fnB(records, {search: 'bar'}).length).toBe(0);
      expect(fnB(records, {search: '9'}).length).toBe(0);

    });
    it('should return all the records if search is empty or not a string', () => {
      const records = [{a: 'foo'}, {a: 'bar'}];
      const fn = NgxListFilters.searchFilter({filterKey: 'search'});
      expect(fn(records, {}).length).toBe(2);
      expect(fn(records, {search: {}}).length).toBe(2);
      expect(fn(records, {search: '   '}).length).toBe(2);
    });
    it('should use valueFns if specified', () => {
      const records = [{a: 'foo'}, {a: 'bar'}];
      const valueFn = (record: any) => (record.a as string)[0] + 'xxx';
      const fn = NgxListFilters.searchFilter({filterKey: 'search', valueFns: {a: valueFn}});
      expect(fn(records, {search: 'foo'}).length).toBe(0);
      expect(fn(records, {search: 'fxxx'}).length).toBe(1);
      expect(fn(records, {search: 'bar'}).length).toBe(0);
      expect(fn(records, {search: 'bxxx'}).length).toBe(1);
    });
  });

  describe('comparisonFilter(options)', () => {

    it('should return a function', () => {
      const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a'});
      expect(fn).toEqual(jasmine.any(Function));
    });
    it('should return an empty list if the compare is not handled', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxListFilters.comparisonFilter({
        filterKey: 'foo', value: 'a', compare: NgxListCompare.eq + 2929});
      expect(fn(records, {foo: 8}).length).toBe(0);
    });
    it('should use eq by default', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a'});
      expect(fn(records, {foo: 8}).length).toBe(1);
      expect(fn(records, {foo: '8'}).length).toBe(1);
    });
    it('should use the default ignoreFilterWhen by default', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a'});
      expect(fn(records, {foo: undefined}).length).toBe(records.length);
      expect(fn(records, {foo: ''}).length).toBe(records.length);
      expect(fn(records, {foo: null}).length).toBe(records.length);
    });
    it('should respect the ignoreFilterWhen function passed in', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxListFilters.comparisonFilter({
        filterKey: 'foo',
        value: 'a',
        ignoreFilterWhen: (filterValue) => filterValue === null
      });
      expect(fn(records, {foo: null}).length).toBe(records.length);
      expect(fn(records, {foo: undefined}).length).toBe(0);
      expect(fn(records, {}).length).toBe(0);
      expect(fn(records, {foo: ''}).length).toBe(0);
    });
    it('should use the function if passed in', () => {
      const records = [{a: 'a'}, {a: 'bcdefgf'}];
      const fn = NgxListFilters.comparisonFilter({
        filterKey: 'foo',
        value: (rec) => rec.a.length > 1
      });
      expect(fn(records, {foo: true}).length).toBe(1);
      expect(fn(records, {foo: false}).length).toBe(1);
    });

    describe('comparing string columns', () => {
      let records: any[];
      beforeEach(() => {
        records = [{a: 'a'}, {a: 'A'},  {a: 'z'}, {a: 'z'}];
      });
      it('should work with NgxListCompare.eq', () => {
        const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.eq});
        expect(fn(records, {foo: false}).length).toBe(0);
        expect(fn(records, {foo: 'a'}).length).toBe(1);
        expect(fn(records, {foo: 'A'}).length).toBe(1);
      });
      it('should work with NgxListCompare.neq', () => {
        const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.neq});
        expect(fn(records, {foo: false}).length).toBe(records.length);
        expect(fn(records, {foo: 'a'}).length).toBe(records.length - 1);
        expect(fn(records, {foo: 'A'}).length).toBe(records.length - 1);
      });
      it('should work with NgxListCompare.gte', () => {
        const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.gte});
        expect(fn(records, {foo: 'a'}).length).toBe(records.length - 1);
        expect(fn(records, {foo: 'A'}).length).toBe(records.length);
      });
      it('should work with NgxListCompare.lte', () => {
        const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.lte});
        expect(fn(records, {foo: 'z'}).length).toBe(records.length);
        expect(fn(records, {foo: 'A'}).length).toBe(1);
      });

    });

    describe('comparing numeric columns', () => {
      let records: any[];
      beforeEach(() => {
        records = [{a: 8}, {a: 9}, {a: 200}, {a: -1}, {a: 0}];
      });
      it('should work with NgxListCompare.eq when comparing numeric columns', () => {
        const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.eq});
        expect(fn(records, {foo: 8}).length).toBe(1);
        expect(fn(records, {foo: 200}).length).toBe(1);
        expect(fn(records, {foo: 0}).length).toBe(1);
        expect(fn(records, {foo: -1}).length).toBe(1);
        expect(fn(records, {foo: -344}).length).toBe(0);
      });
      it('should work with NgxListCompare.neq when comparing numeric columns', () => {
        const fn = NgxListFilters.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.neq});
        expect(fn(records, {foo: 8}).length).toBe(records.length - 1);
      });
      it('should work with NgxListCompare.gte when comparing numeric columns', () => {
        const fn = NgxListFilters.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.gte});
        expect(fn(records, {foo: 8}).length).toBe(records.length - 2);
        expect(fn(records, {foo: 6778}).length).toBe(0);
        expect(fn(records, {foo: -6778}).length).toBe(records.length);
      });
      it('should work with NgxListCompare.gt when comparing numeric columns', () => {
        const fn = NgxListFilters.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.gt});
        expect(fn(records, {foo: 8}).length).toBe(records.length - 3);
        expect(fn(records, {foo: 6778}).length).toBe(0);
        expect(fn(records, {foo: -6778}).length).toBe(records.length);
      });
      it('should work with NgxListCompare.lte when comparing numeric columns', () => {
        const fn = NgxListFilters.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.lte});
        expect(fn(records, {foo: -1}).length).toBe(1);
        expect(fn(records, {foo: 6778}).length).toBe(records.length);
        expect(fn(records, {foo: -6778}).length).toBe(0);
      });
      it('should work with NgxListCompare.lt when comparing numeric columns', () => {
        const fn = NgxListFilters.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.lt});
        expect(fn(records, {foo: -1}).length).toBe(0);
        expect(fn(records, {foo: 0}).length).toBe(1);
        expect(fn(records, {foo: 6778}).length).toBe(records.length);
        expect(fn(records, {foo: -6778}).length).toBe(0);
      });
    });

    describe('comparing boolean columns', () => {
      let records: any[];
      beforeEach(() => {
        records = [{a: true}, {a: false}, {a: false}];
      });
      it('should work with NgxListCompare.eq', () => {
        const fn = NgxListFilters.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.eq});
        expect(fn(records, {foo: 8}).length).toBe(0);
        expect(fn(records, {foo: true}).length).toBe(1);
        expect(fn(records, {foo: false}).length).toBe(2);
      });
    });

  });
});
