import { NgxListSort } from './sort';

describe('NgxListSort', () => {
  let records: any[];
  let fn: any;
  it('should work out of the box with string columns', () => {
    records = [
      {name: 'Zebra', id: 1},
      {name: 'Aardvark',  id: 3},
      {name: 'Monkey',  id: 5},
    ];
    fn = NgxListSort.sortFn({});
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
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id'});
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
    fn = NgxListSort.sortFn({caseSensitive: true});
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
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id'});
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
    fn = NgxListSort.sortFn( {fallbackSortColumn: 'id', valueFns: {name: () => 'a'}});
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
    fn = NgxListSort.sortFn();
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
    fn = NgxListSort.sortFn();
    const result = fn(records, 'profile.name');
    expect(result[0].id).toBe(67);
  });
});
