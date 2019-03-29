import { BehaviorSubject } from 'rxjs';
import {
  Record,
  ListInit
} from './shared';
import { List } from './list';



describe('List', () => {
  let recordSubject$: BehaviorSubject<Record[]>;
  let init: ListInit;
  beforeEach(() => {
    recordSubject$ = new BehaviorSubject([]);
    init = {
      src$: recordSubject$.asObservable()
    };
  });
  it('should create an instance', () => {
    expect(new List(init)).toBeTruthy();
  });

  it('should sort by a string column', () => {
    recordSubject$.next([
      {name: 'Zebra', age: 4},
      {name: 'Aardvark', age: 8},
      {name: 'Monkey', age: 3}
    ]);
    init.initialParams = {sortColumn: 'name'};
    const list = new List(init);
    expect(list.records[0].name).toBe('Aardvark');
    expect(list.records[2].name).toBe('Zebra');
    list.setSort('name', true);
    expect(list.records[0].name).toBe('Zebra');
    recordSubject$.next([
      {name: 'Zebra', age: 4},
      {name: 'Aardvark', dob: 8},
      {name: 'Monkey', dob: 3},
      {name: 'manatee', dob: 3},
      {name: 'zyggy', age: 89},
      {name: 'zaggy', age: 0},
    ]);
    console.log(list.records.map(o => o.name));
    list.setSort('name', false);
    console.log(list.records.map(o => o.name));
  });

});
