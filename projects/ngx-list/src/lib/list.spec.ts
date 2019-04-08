import { BehaviorSubject } from 'rxjs';
import {
  NgxListRecord, NgxListCompare
} from './shared';
import { NgxList } from './list';
import set from 'lodash/set';
import get from 'lodash/get';



describe('NgxList', () => {
  let recordSubject$: BehaviorSubject<NgxListRecord[]>;
  let init: any;
  let list: NgxList;
  beforeEach(() => {
    recordSubject$ = new BehaviorSubject([]);
    init = {
      src$: recordSubject$.asObservable(),
      idKey: 'id'
    };
    list = new NgxList(init);
  });
  it('should create an instance', () => {
    expect(list).toBeTruthy();
  });

  describe('getters', () => {
    it('should have results$', () => {
      expect(list.results$.subscribe).toBeTruthy();
    });
    it('should have currentResult', () => {
      expect(list.currentResult).toBeTruthy();
    });
    it('should have records', () => {
      expect(list.records).toBeTruthy();
      expect(list.records).toBe(list.currentResult.records);
    });
    it('should have page', () => {
      expect(list.page).toBe(list.currentResult.page);
    });
    it('should have pageCount', () => {
      expect(list.pageCount).toBe(list.currentResult.pageCount);
    });
    it('should have recordCount', () => {
      expect(list.recordCount).toBe(list.currentResult.recordCount);
    });
    it('should have recordsPerPage', () => {
      expect(list.recordsPerPage).toBe(list.currentResult.recordsPerPage);
    });
    it('should have unfilteredRecordCount', () => {
      expect(list.unfilteredRecordCount).toBe(list.currentResult.unfilteredRecordCount);
    });
    it('should have filterValues', () => {
      expect(list.filterValues).toEqual(list.currentResult.filterValues);
    });
    it('should have sort', () => {
      expect(list.sort).toEqual(list.currentResult.sort);
    });

  });



  it('should have  destroy()', () => {
    expect(recordSubject$.observers.length).toBe(1);
    list.destroy();
    expect(recordSubject$.observers.length).toBe(0);
  });

  it('should recalculate on setPage()', () => {
    let recalculated = 0;
    list.results$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setPage(0);
    expect(recalculated).toBe(2);
  });
  it('should recalculate on setRecordsPerPage()', () => {
    let recalculated = 0;
    list.results$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setRecordsPerPage(0);
    expect(recalculated).toBe(2);
  });

  it('should recalculate on setSort()', () => {
    let recalculated = 0;
    list.results$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setSort({key: 'a', reversed: true});
    expect(recalculated).toBe(2);
  });


  it('should recalculate on setFilterValue()', () => {
    let recalculated = 0;
    list.results$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setFilterValue('foo', 22);
    expect(recalculated).toBe(2);
  });

  describe('setFilterParam', () => {
    it('should not delete the filterParam key if passed null or undefined', () => {
      list.setFilterValue('foo', 22);
      expect(list.filterValues.foo).toBe(22);
      list.setFilterValue('foo', null);
      expect(list.filterValues.foo).toBe(null);
      list.setFilterValue('foo', undefined);
      expect(list.filterValues.foo).toBe(undefined);
    });
  });




  describe('ignoreFilterWhen(value)', () => {
    it('should return true when passed undefined', () => {
      expect(NgxList.ignoreFilterWhen(undefined)).toBe(true);
    });
    it('should return true when passed null', () => {
      expect(NgxList.ignoreFilterWhen(null)).toBe(true);
    });
    it('should return true when passed an empty string', () => {
      expect(NgxList.ignoreFilterWhen('')).toBe(true);
    });
    it('should return true when passed a string with only whitespace', () => {
      expect(NgxList.ignoreFilterWhen('   ')).toBe(true);
    });
    it('should return false for a non-empty string', () => {
        expect(NgxList.ignoreFilterWhen('foo')).toBe(false);
    });
    it('should return false for an object', () => {
        expect(NgxList.ignoreFilterWhen({})).toBe(false);
    });
    it('should return false for a number 0', () => {
        expect(NgxList.ignoreFilterWhen(0)).toBe(false);
    });
    it('should return false for a string "0"', () => {
        expect(NgxList.ignoreFilterWhen('0')).toBe(false);
    });
  });
  describe('searchFilter(options)', () => {
    it('should return a function', () => {
      const fn = NgxList.searchFilter({filterKey: 'search'});
      expect(fn).toEqual(jasmine.any(Function));
    });
    it('should match case-insensitively by default', () => {
      const records = [{a: 'foo'}, {a: 'Foo'}];
      const fn = NgxList.searchFilter({filterKey: 'search'});
      expect(fn(records, {search: 'foo'}).length).toBe(2);
      expect(fn(records, {search: 'Foo'}).length).toBe(2);
      expect(fn(records, {search: 'FoO'}).length).toBe(2);
    });
    it('should match case-sensitively if caseSensitive', () => {
      const records = [{a: 'foo'}, {a: 'Foo'}];
      const fn = NgxList.searchFilter({filterKey: 'search', caseSensitive: true});
      expect(fn(records, {search: 'foo'}).length).toBe(1);
      expect(fn(records, {search: 'Foo'}).length).toBe(1);
      expect(fn(records, {search: 'FoO'}).length).toBe(0);
    });
    it('should ignore keys if ignoredKeys is set', () => {
      const records = [{a: 'foo', b: 'xyz', c: {}}, {a: 'bar',  b: 'abc', c: {}}];
      const fn = NgxList.searchFilter({filterKey: 'search', ignoredKeys: ['b', 'c']});
      expect(fn(records, {search: 'xyz'}).length).toBe(0);
      expect(fn(records, {search: 'abc'}).length).toBe(0);
      expect(fn(records, {search: 'object'}).length).toBe(0);
      expect(fn(records, {search: 'foo'}).length).toBe(1);
      expect(fn(records, {search: 'bar'}).length).toBe(1);
      // without ignored keys...
      const fnB =  NgxList.searchFilter({filterKey: 'search', ignoredKeys: []});
      expect(fnB(records, {search: 'xyz'}).length).toBe(1);
      expect(fnB(records, {search: 'abc'}).length).toBe(1);
      expect(fnB(records, {search: 'foo'}).length).toBe(1);
      expect(fnB(records, {search: 'bar'}).length).toBe(1);
    });
    it('should return all the records if search is empty or not a string', () => {
      const records = [{a: 'foo'}, {a: 'bar'}];
      const fn = NgxList.searchFilter({filterKey: 'search'});
      expect(fn(records, {}).length).toBe(2);
      expect(fn(records, {search: {}}).length).toBe(2);
      expect(fn(records, {search: '   '}).length).toBe(2);
    });
    it('should use valueFns if specified', () => {
      const records = [{a: 'foo'}, {a: 'bar'}];
      const valueFn = (record: any) => (record.a as string)[0] + 'xxx';
      const fn = NgxList.searchFilter({filterKey: 'search', valueFns: {a: valueFn}});
      expect(fn(records, {search: 'foo'}).length).toBe(0);
      expect(fn(records, {search: 'fxxx'}).length).toBe(1);
      expect(fn(records, {search: 'bar'}).length).toBe(0);
      expect(fn(records, {search: 'bxxx'}).length).toBe(1);
    });
  });

  describe('comparisonFilter(options)', () => {

    it('should return a function', () => {
      const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a'});
      expect(fn).toEqual(jasmine.any(Function));
    });
    it('should return an empty list if the compare is not handled', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxList.comparisonFilter({
        filterKey: 'foo', value: 'a', compare: NgxListCompare.eq + 2929});
      expect(fn(records, {foo: 8}).length).toBe(0);
    });
    it('should use eq by default', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a'});
      expect(fn(records, {foo: 8}).length).toBe(1);
      expect(fn(records, {foo: '8'}).length).toBe(1);
    });
    it('should use the default ignoreFilterWhen by default', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a'});
      expect(fn(records, {foo: undefined}).length).toBe(records.length);
      expect(fn(records, {foo: ''}).length).toBe(records.length);
      expect(fn(records, {foo: null}).length).toBe(records.length);
    });
    it('should respect the ignoreFilterWhen function passed in', () => {
      const records = [{a: 8}, {a: 9}, {a: 200}, {a: '8'}];
      const fn = NgxList.comparisonFilter({
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
      const fn = NgxList.comparisonFilter({
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
        const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.eq});
        expect(fn(records, {foo: false}).length).toBe(0);
        expect(fn(records, {foo: 'a'}).length).toBe(1);
        expect(fn(records, {foo: 'A'}).length).toBe(1);
      });
      it('should work with NgxListCompare.neq', () => {
        const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.neq});
        expect(fn(records, {foo: false}).length).toBe(records.length);
        expect(fn(records, {foo: 'a'}).length).toBe(records.length - 1);
        expect(fn(records, {foo: 'A'}).length).toBe(records.length - 1);
      });
      it('should work with NgxListCompare.gte', () => {
        const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.gte});
        expect(fn(records, {foo: 'a'}).length).toBe(records.length - 1);
        expect(fn(records, {foo: 'A'}).length).toBe(records.length);
      });
      it('should work with NgxListCompare.lte', () => {
        const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.lte});
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
        const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.eq});
        expect(fn(records, {foo: 8}).length).toBe(1);
        expect(fn(records, {foo: 200}).length).toBe(1);
        expect(fn(records, {foo: 0}).length).toBe(1);
        expect(fn(records, {foo: -1}).length).toBe(1);
        expect(fn(records, {foo: -344}).length).toBe(0);
      });
      it('should work with NgxListCompare.neq when comparing numeric columns', () => {
        const fn = NgxList.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.neq});
        expect(fn(records, {foo: 8}).length).toBe(records.length - 1);
      });
      it('should work with NgxListCompare.gte when comparing numeric columns', () => {
        const fn = NgxList.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.gte});
        expect(fn(records, {foo: 8}).length).toBe(records.length - 2);
        expect(fn(records, {foo: 6778}).length).toBe(0);
        expect(fn(records, {foo: -6778}).length).toBe(records.length);
      });
      it('should work with NgxListCompare.gt when comparing numeric columns', () => {
        const fn = NgxList.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.gt});
        expect(fn(records, {foo: 8}).length).toBe(records.length - 3);
        expect(fn(records, {foo: 6778}).length).toBe(0);
        expect(fn(records, {foo: -6778}).length).toBe(records.length);
      });
      it('should work with NgxListCompare.lte when comparing numeric columns', () => {
        const fn = NgxList.comparisonFilter({
          filterKey: 'foo', value: 'a', compare: NgxListCompare.lte});
        expect(fn(records, {foo: -1}).length).toBe(1);
        expect(fn(records, {foo: 6778}).length).toBe(records.length);
        expect(fn(records, {foo: -6778}).length).toBe(0);
      });
      it('should work with NgxListCompare.lt when comparing numeric columns', () => {
        const fn = NgxList.comparisonFilter({
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
        const fn = NgxList.comparisonFilter({filterKey: 'foo', value: 'a', compare: NgxListCompare.eq});
        expect(fn(records, {foo: 8}).length).toBe(0);
        expect(fn(records, {foo: true}).length).toBe(1);
        expect(fn(records, {foo: false}).length).toBe(2);
      });
    });

  });

  describe('dotKeys', () => {
    it('should work', () => {
      expect(NgxList.dotKeys({a: {b: 8, c: 3}})).toContain('a.b');
      expect(NgxList.dotKeys({a: {b: 8, c: 3}})).toContain('a.c');

    });
    it('should work with arrays', () => {
      expect(NgxList.dotKeys({a: [8, 9]})).toContain('a.0');
      expect(NgxList.dotKeys({a: [8, 9]})).toContain('a.1');
      expect(get({a: [8, 9]}, 'a.1')).toBe(9);
    });
    it('should contain all the keys', () => {
      const o = {};
      set(o, 'a.date', new Date());
      set(o, 'a.nullish', null);
      set(o, 'a.b', {});
      expect(NgxList.dotKeys(o).length).toBe(4);
    });
    it('should exclude all the keys under a path', () => {
      const o = {a: 'foo', b: {c: 45, d: 45}};
      expect(NgxList.dotKeys(o, ['b']).length).toBe(1);
    });
    it('should exclude a key under a path', () => {
      const o = {a: 'foo', b: {c: 45, d: 45}};
      expect(NgxList.dotKeys(o, ['b.d']).length).toBe(3);
      expect(NgxList.dotKeys(o, ['b.d'])).toContain('b.c');
      expect(NgxList.dotKeys(o, ['b.d'])).not.toContain('b.d');
    });

  });


  describe('keySearchValue(rec, key, valueFn)', () => {
    it('should always return the value function result if defined for the key', () => {
      const f = () => 'Hi There!';
      const valueFns = {'a.b.c': f };
      const spy = spyOn(valueFns, 'a.b.c').and.callThrough();
      const o = {a: {b: {c: 'foo'}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', valueFns)).toBe('Hi There!');
      expect(spy).toHaveBeenCalledWith(o);
    });
    it('should always return the result of the value function as a string', () => {
      const f = () => 100;
      const valueFns = {'a.b.c': f };
      const spy = spyOn(valueFns, 'a.b.c').and.callThrough();
      const o = {a: {b: {c: 'foo'}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', valueFns)).toBe('100');
      expect(spy).toHaveBeenCalledWith(o);
    });
    it('should return empty string for undefined', () => {
      const o = {a: {b: {c: 'foo'}}};
      expect(NgxList.keySearchValue(o, 'a.b.d', {})).toBe('');
    });
    it('should return empty string for boolean', () => {
      const o = {a: {b: {c: true}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('');
    });
    it('should return empty string for a plain object', () => {
      const o = {a: {b: {c: {x: 1}}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('');
    });
    it('should return empty string for an array', () => {
      const o = {a: {b: {c: ['foo', 'bar']}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('');
    });
    it('should return empty string for a function', () => {
      const o = {a: {b: {c: () => {}}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('');
    });
    it('should return empty string for a NaN', () => {
      const o = {a: {b: {c: parseInt('foo', 10)}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('');
    });
    it('should return tHe string if defined', () => {
      const o = {a: {b: {c: 'foo'}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('foo');
    });
    it('should always convert to string', () => {
      const o = {a: {b: {c: -8.9}}};
      expect(NgxList.keySearchValue(o, 'a.b.c', {})).toBe('-8.9');
    });
  });

  describe('recordMatchesSearch(rec, casedSearch, caseSensitive, ignoredKeys, valueFns)', () => {
    it('should match a number', () => {
      const o = {a: {b: {c: -8.9}}};
      expect(NgxList.recordMatchesSearch(o, '8', false, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, '8.9', false, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, '-8.9', false, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, '-9.9', false, [], {})).toBe(false);
    });
    it('should match a string', () => {
      const o = {a: {b: {c: 'foo bar'}}};
      expect(NgxList.recordMatchesSearch(o, 'bar', false, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, 'bar', true, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, 'Bar', true, [], {})).toBe(false);
    });
    it('should not match plain objects', () => {
      const o = {a: {b: {c: 'foo bar', d: {n: 89}}}};
      expect(o.a.b.d.toString()).toContain('object');
      expect(NgxList.recordMatchesSearch(o, 'object', false, [], {})).toBe(false);
    });
    it('should not match arrays, but should match indiovidual elements', () => {
      const o: any = {a: {b: {c: 'foo bar', d: [89, 75]}}};
      expect(o.a.b.d.toString()).toBe('89,75');
      expect(NgxList.recordMatchesSearch(o, '89.75', false, [], {})).toBe(false);
      expect(NgxList.recordMatchesSearch(o, '89', false, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, '75', false, [], {})).toBe(true);
      o.a.b.d = ['xyz', 'abc'];
      expect(o.a.b.d.toString()).toBe('xyz,abc');
      expect(NgxList.recordMatchesSearch(o, 'xyz,abc', false, [], {})).toBe(false);
      expect(NgxList.recordMatchesSearch(o, 'xy', false, [], {})).toBe(true);
      expect(NgxList.recordMatchesSearch(o, 'bc', false, [], {})).toBe(true);
    });
    it('should not match booleans', () => {
      const o: any = {a: {b: {c: 'foo bar', d: false}}};
      expect(o.a.b.d.toString()).toBe('false');
      expect(NgxList.recordMatchesSearch(o, 'false', false, [], {})).toBe(false);
    });
    it('should not match null', () => {
      const o: any = {a: {b: {c: 'foo bar', d: null}}};
      expect(NgxList.recordMatchesSearch(o, 'object', false, [], {})).toBe(false);
    });
    it('should not match undefined', () => {
      const o: any = {a: {b: {c: 'foo bar', d: undefined}}};
      expect(NgxList.recordMatchesSearch(o, 'undefined', false, [], {})).toBe(false);
    });
  });

  describe('sorting', () => {
    let records: any[];
    let fn: any;
    it('should work out of the box with string columns', () => {
      records = [
        {name: 'Zebra', id: 1},
        {name: 'Aardvark',  id: 3},
        {name: 'Monkey',  id: 5},
      ];
      fn = NgxList.sortFn({});
      const result = fn(records, 'name');
      expect(result[0].name).toBe('Aardvark');
      expect(result[1].name).toBe('Monkey');
      expect(result[2].name).toBe('Zebra');
    });
    it('should be case insensitive out of the box', () => {
      records = [
        {name: 'Zebra', id: 1},
        {name: 'Aardvark',  id: 3},
        {name: 'aardvark',  id: 2},
        {name: 'Monkey',  id: 5},
      ];
      fn = NgxList.sortFn({fallbackSortColumn: 'id'});
      const result = fn(records, 'name');
      expect(result[0].name).toBe('aardvark');
      expect(result[1].name).toBe('Aardvark');
    });
    it('should be case sensitive if passed true for caseSensitive', () => {
      records = [
        {name: 'Zebra', id: 1},
        {name: 'Aardvark',  id: 3},
        {name: 'aardvark',  id: 2},
        {name: 'Monkey',  id: 5},
      ];
      fn = NgxList.sortFn({caseSensitive: true});
      const result = fn(records, 'name');
      expect(result[0].name).toBe('Aardvark');
      expect(result[1].name).toBe('Monkey');
      expect(result[2].name).toBe('Zebra');
      expect(result[3].name).toBe('aardvark');
    });
    it('should obey fallbackSortColumn if defined', () => {
      records = [
        {name: 'a', id: 206},
        {name: 'a', id: 2},
        {name: 'a', id: 4},
        {name: 'a', id: 8},
        {name: 'a',  id: 9},
      ];
      fn = NgxList.sortFn({fallbackSortColumn: 'id'});
      const result = fn(records, 'name');
      expect(result[0].id).toBe(2);
      expect(result[4].id).toBe(206);
    });

    it('should use a valueFn if provided', () => {
      records = [
        {name: 'Zebra', id: 206},
        {name: 'zebra', id: 2},
        {name: 'zebrA', id: 4},
        {name: 'Aardvark', id: 8},
        {name: 'Monkey',  id: 9},
      ];
      fn = NgxList.sortFn( {fallbackSortColumn: 'id', valueFns: {name: () => 'a'}});
      const result = fn(records, 'name');
      expect(result[0].name).toBe('zebra');
      expect(result[result.length - 1].name).toBe('Zebra');
    });

    it('should sort by a numeric field', () => {
      records = [
        {name: 'Zebra', id: 206},
        {name: 'zebra', id: 2},
        {name: 'zebrA', id: 4},
        {name: 'Aardvark', id: 8},
        {name: 'Monkey',  id: 9},
      ];
      fn = NgxList.sortFn();
      const result = fn(records, 'id');
      expect(result[0].name).toBe('zebra');
      expect(result[result.length - 1].name).toBe('Zebra');
    });
    it('should work with nested column keys', () => {
      records = [
        {id: 3, profile: {name: 'z'}},
        {id: 45, profile: {name: 'q'}},
        {id: 67, profile: {name: 'b'}},
      ];
      fn = NgxList.sortFn();
      const result = fn(records, 'profile.name');
      expect(result[0].id).toBe(67);
    });
  });



});
