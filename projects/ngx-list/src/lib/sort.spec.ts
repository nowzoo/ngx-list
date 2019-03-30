import { NgxListSort } from './sort';

describe('NgxListSort', () => {
  let records: any[];
  let fn: any;
  beforeEach(() => {

  });
  it('should work with string columns', () => {
    records = [
      {name: 'Zebra', id: 1},
      {name: 'Aardvark',  id: 3},
      {name: 'Monkey',  id: 5},
    ];
    fn = NgxListSort.sortFn();
    const result = fn(records, 'name');
    expect(result[0].name).toBe('Aardvark');
    expect(result[1].name).toBe('Monkey');
    expect(result[2].name).toBe('Zebra');
  });
  it('should obey fallbackSortColumn if defined', () => {
    records = [
      {name: 'Zebra', id: 206},
      {name: 'zebra', id: 2},
      {name: 'zebrA', id: 4},
      {name: 'Aardvark', id: 8},
      {name: 'Monkey',  id: 9},
    ];
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id'});
    const result = fn(records, 'name');
    expect(result[0].name).toBe('Aardvark');
    expect(result[2].name).toBe('zebra');
    expect(result[3].name).toBe('zebrA');
    expect(result[4].name).toBe('Zebra');
  });

  it('should use a valueFn if provided', () => {
    records = [
      {name: 'Zebra', id: 206},
      {name: 'zebra', id: 2},
      {name: 'zebrA', id: 4},
      {name: 'Aardvark', id: 8},
      {name: 'Monkey',  id: 9},
    ];
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id', valueFns: {name: () => 'a'}});
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
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id'});
    const result = fn(records, 'id');
    expect(result[0].name).toBe('zebra');
    expect(result[result.length - 1].name).toBe('Zebra');
  });
  it('should work if no fallbackSortColumn is provided', () => {
    records = [
      {name: 'Zebra', id: 206},
      {name: 'zebra', id: 2},
      {name: 'zebrA', id: 4},
      {name: 'Aardvark', id: 8},
      {name: 'Monkey',  id: 9},
    ];
    fn = NgxListSort.sortFn();
    const result = fn(records, 'name');
    expect(result[0].name).toBe('Aardvark');
  });
  it('should work if the fallbackSortColumn is the same as sortColumn', () => {
    records = [
      {name: 'Zebra', id: 206},
      {name: 'zebra', id: 206},
      {name: 'zebrA', id: 4},
      {name: 'Aardvark', id: 8},
      {name: 'Monkey',  id: 9},
    ];
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id'});
    const result = fn(records, 'id');
    expect(result[0].name).toBe('zebrA');
  });
  it('should work if the fallbackSortColumn has a valueFn', () => {
    records = [
      {name: 'Zebra', id: 206},
      {name: 'zebra', id: 206},
      {name: 'zebrA', id: 4},
      {name: 'Aardvark', id: 8},
      {name: 'Monkey',  id: 9},
    ];
    fn = NgxListSort.sortFn({fallbackSortColumn: 'id', valueFns: {id: (r) => r.id * 2}});
    const result = fn(records, 'id');
    expect(result[0].name).toBe('zebrA');
  });
  it('should work if the case insensitive is false', () => {
    records = [
      {name: 'aardvark',  id: 9},
      {name: 'Zebra', id: 206},
      {name: 'Aardvark', id: 8},
      ,
    ];
    fn = NgxListSort.sortFn({caseInsensitive: false});
    const result = fn(records, 'name');
    expect(result[0].name).toBe('Aardvark');
    expect(result[1].name).toBe('Zebra');
    expect(result[2].name).toBe('aardvark');
  });
  it('should work if the case insensitive is true', () => {
    records = [
      {name: 'aardvark',  id: 9},
      {name: 'Zebra', id: 206},
      {name: 'Aardvark', id: 8},
      ,
    ];
    fn = NgxListSort.sortFn({caseInsensitive: true, fallbackSortColumn: 'id'});
    const result = fn(records, 'name');
    expect(result[0].name).toBe('Aardvark');
    expect(result[1].name).toBe('aardvark');
    expect(result[2].name).toBe('Zebra');
  });

  it('should work if sortColumn is empty', () => {
    records = [
      {name: 'Zebra', id: 1},
      {name: 'Aardvark',  id: 3},
      {name: 'Monkey',  id: 5},
    ];
    fn = NgxListSort.sortFn();
    const result = fn(records);
    expect(result[0].name).toBe('Zebra');
  });
});


describe('compareValues(a: any, b: any, caseInsensitive: boolean)', () => {
  it('should return the right results for strings', () => {
    expect(NgxListSort.compareValues('a', 'b', true)).toBe(-1);
    expect(NgxListSort.compareValues('b', 'b', true)).toBe(0);
    expect(NgxListSort.compareValues('c', 'b', true)).toBe(1);
    expect(NgxListSort.compareValues('A', 'a', false)).toBe(-1);
    expect(NgxListSort.compareValues('a', 'A', false)).toBe(1);
    expect(NgxListSort.compareValues('A', 'A', false)).toBe(0);
  });
  it('should return the right results for numbers', () => {
    expect(NgxListSort.compareValues(1, 2, true)).toBe(-1);
    expect(NgxListSort.compareValues(1, 2, false)).toBe(-1);
    expect(NgxListSort.compareValues(2, 2, true)).toBe(0);
    expect(NgxListSort.compareValues(2, 2, false)).toBe(0);
    expect(NgxListSort.compareValues(3, 2, true)).toBe(1);
    expect(NgxListSort.compareValues(3, 2, false)).toBe(1);
  });
  it('should return the right results for undefined and null', () => {
    expect(NgxListSort.compareValues(null, null, true)).toBe(0);
    expect(NgxListSort.compareValues(null, undefined, true)).toBe(0);
    expect(NgxListSort.compareValues(undefined, undefined, true)).toBe(0);
    expect(NgxListSort.compareValues(undefined, null, true)).toBe(0);
    expect(NgxListSort.compareValues(undefined, 1, true)).toBe(1);
    expect(NgxListSort.compareValues(1, undefined, true)).toBe(-1);
  });
});
