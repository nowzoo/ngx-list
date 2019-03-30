import { NgxListFilters } from './filters';

import {
  NgxListFilterFn,
  NgxListRecord,
  NgxListSearchFilterOptions,
  NgxListFilterOptions,
  NgxListCompare
} from './api';


describe('searchFilter', () => {
  let records: any[];
  beforeEach(() => {
    records = [
      {name: 'Zebra', age: 4, bio: 'foo bar'},
      {name: 'Aardvark', age: 8, bio: 'baz bag'},
      {name: 'Monkey', age: 3, bio: 'Foo Bar and some'}
    ];
  });
  it('should return a function', () => {
    expect(NgxListFilters.searchFilter({filterKey: 'search'})).toEqual(jasmine.any(Function));
  });
  describe('default options', () => {
    let searchFn: any;
    let filterParams: any;
    let options: NgxListSearchFilterOptions;
    beforeEach(() => {
      options = {filterKey: 'search'};
      filterParams = {};
      searchFn = NgxListFilters.searchFilter(options);
    });
    it('should return all the records if the search key is not set', () => {
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(3);
      expect(results[0].name).toBe('Zebra');
      expect(results[2].name).toBe('Monkey');
    });
    it('should return all the records if the search key is empty', () => {
      filterParams.search = ' ';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(3);
      expect(results[0].name).toBe('Zebra');
      expect(results[2].name).toBe('Monkey');
    });
    it('should return some of the records if the search key is not empty', () => {
      filterParams.search = 'Zebra';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Zebra');
    });
    it('should do case insensitive search by default', () => {
      filterParams.search = 'foo bar';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(2);
      expect(results[0].name).toBe('Zebra');
      expect(results[1].name).toBe('Monkey');
    });
    it('should search number fields', () => {
      filterParams.search = '8';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Aardvark');
    });

  });
  describe('passing caseInsensitive = false', () => {
    let searchFn: any;
    let filterParams: any;
    let options: NgxListSearchFilterOptions;
    beforeEach(() => {
      options = {filterKey: 'search'};
      filterParams = {};
      options.caseInsensitive = false;
      searchFn = NgxListFilters.searchFilter(options);
      records = [
        {name: 'Zebra', age: 4, bio: 'foo bar'},
        {name: 'Aardvark', age: 8, bio: 'baz bag'},
        {name: 'Monkey', age: 3, bio: 'Foo Bar and some'}
      ];
    });
    it('should do case sensitive search', () => {
      filterParams.search = 'foo bar';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Zebra');
    });
    it('should do case sensitive search', () => {
      filterParams.search = 'A';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Aardvark');
    });


  });
  describe('passing valuFns', () => {
    let searchFn: any;
    let filterParams: any;
    let ageValueFn: any;
    beforeEach(() => {
      filterParams = {};
      ageValueFn = (r: any) => (r.age * 2);
      searchFn = NgxListFilters.searchFilter({filterKey: 'search', valueFns: {age: ageValueFn}});
      records = [
        {name: 'Zebra', age: 4, bio: 'foo bar'},
        {name: 'Aardvark', age: 8, bio: 'baz bag'},
        {name: 'Monkey', age: 3, bio: 'Foo Bar and some'}
      ];
    });
    it('should do use the valueFn defined for the key', () => {
      filterParams.search = '3';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(0);
    });

  });
  describe('passing ignoreKeys', () => {
    let searchFn: any;
    let filterParams: any;
    beforeEach(() => {
      filterParams = {};
      searchFn = NgxListFilters.searchFilter({filterKey: 'search', ignoreKeys: ['bio']});
      records = [
        {name: 'Zebra', age: 4, bio: 'foo bar'},
        {name: 'Aardvark', age: 8, bio: 'baz bag'},
        {name: 'Monkey', age: 3, bio: 'Foo Bar and some'}
      ];
    });
    it('should ignore the bio fieldd', () => {
      filterParams.search = 'foo';
      const results = searchFn(records, filterParams);
      expect(results.length).toBe(0);
    });

  });
});

describe('searchFilter()', () => {
  let options: NgxListFilterOptions;
  let records: NgxListRecord[];
  let filterFn: NgxListFilterFn;
  let filterParams: any;
  describe('filtering by a numeric column', () => {
    beforeEach(() => {
      filterParams = {};
      records = [
        {name: 'Zebra', age: 4},
        {name: 'Aardvark', age: 8},
        {name: 'Monkey', age: 3}
      ];
      options = {
        filterKey: 'age',
        columnKey: 'age'
      };

    });
    it('should return 1 rec for 8', () => {
      filterParams = {age: 8};
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, filterParams);
      expect(results.length).toBe(1);
    });
    it('should return 3 records for null', () => {
      filterParams = {age: null};
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, filterParams);
      expect(results.length).toBe(3);
    });
    it('should return 3 records for undefined if that is passed in ignoreWhenFilterIs', () => {
      filterParams = {};
      options.ignoreWhenFilterIs = undefined;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, filterParams);
      expect(results.length).toBe(3);
    });
    it('should handle being passed a valueFn', () => {
      filterParams = {age: 16};
      options.valueFn = (r: NgxListRecord) => r.age * 2;
      filterFn = NgxListFilters.comparisonFilter(options);
      let results = filterFn(records, filterParams);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Aardvark');
      records.push({name: 'Foo', age: 8});
      results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
    });
    it('should handle lte', () => {
      filterParams = {age: 4};
      options.compare = NgxListCompare.lte;
      filterFn = NgxListFilters.comparisonFilter(options);
      let results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
      filterParams = {age: 8};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(3);
      filterParams = {age: 7};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
      filterParams = {age: 2};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(0);
    });
    it('should handle lt', () => {
      filterParams = {age: 4};
      options.compare = NgxListCompare.lt;
      filterFn = NgxListFilters.comparisonFilter(options);
      let results = filterFn(records, filterParams);
      expect(results.length).toBe(1);
      filterParams = {age: 8};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
      filterParams = {age: 7};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
      filterParams = {age: 3};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(0);
    });

    it('should handle gte', () => {
      filterParams = {age: 4};
      options.compare = NgxListCompare.gte;
      filterFn = NgxListFilters.comparisonFilter(options);
      let results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
      filterParams = {age: 8};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(1);
      filterParams = {age: 9};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(0);
      filterParams = {age: 3};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(3);
    });

    it('should handle gt', () => {
      filterParams = {age: 4};
      options.compare = NgxListCompare.gt;
      filterFn = NgxListFilters.comparisonFilter(options);
      let results = filterFn(records, filterParams);
      expect(results.length).toBe(1);
      filterParams = {age: 8};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(0);
      filterParams = {age: 9};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(0);
      filterParams = {age: 3};
      results = filterFn(records, filterParams);
      expect(results.length).toBe(2);
    });
    it('should handle some unknown compare', () => {
      filterParams = {age: 4};
      options.compare = NgxListCompare.gt + 566;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, filterParams);
      expect(results.length).toBe(0);
    });
  });
  describe('filtering by a string column', () => {
    beforeEach(() => {
      filterParams = {};
      records = [
        {name: 'Zebra', age: 4},
        {name: 'Aardvark', age: 8},
        {name: 'Monkey', age: 3}
      ];
      options = {
        filterKey: 'name',
        columnKey: 'name'
      };

    });
    it('should return only records which exactly match', () => {
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, {name: 'Zebra'});
      expect(results.length).toBe(1);
    });
    it('should compare insensitively if caseInsensitive is true', () => {
      options.caseInsensitive = true;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, {name: 'zebra'});
      expect(results.length).toBe(1);
    });
    it('should handle lte', () => {
      options.compare = NgxListCompare.lte;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, {name: 'Zebra'});
      expect(results.length).toBe(3);
    });
    it('should handle lt', () => {
      options.compare = NgxListCompare.lt;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, {name: 'Zebra'});
      expect(results.length).toBe(2);
    });
    it('should handle gte', () => {
      options.compare = NgxListCompare.gte;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, {name: 'Zebra'});
      expect(results.length).toBe(1);
    });
    it('should handle gt', () => {
      options.compare = NgxListCompare.gt;
      filterFn = NgxListFilters.comparisonFilter(options);
      const results = filterFn(records, {name: 'Zebra'});
      expect(results.length).toBe(0);
    });
  });
});
