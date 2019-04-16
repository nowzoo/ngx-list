import { BehaviorSubject } from 'rxjs';
import { NgxList } from './list';
import { NgxListFnFactory } from './fn-factory';

describe('NgxList', () => {
  let recordSubject$: BehaviorSubject<any[]>;
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
    it('should have result$', () => {
      expect(list.result$.subscribe).toBeTruthy();
    });
    it('should have result', () => {
      expect(list.result).toBeTruthy();
    });
    it('should have records', () => {
      expect(list.records).toBeTruthy();
      expect(list.records).toBe(list.result.records);
    });
    it('should have page', () => {
      expect(list.page).toBe(list.result.page);
    });
    it('should have pageCount', () => {
      expect(list.pageCount).toBe(list.result.pageCount);
    });
    it('should have recordCount', () => {
      expect(list.recordCount).toBe(list.result.recordCount);
    });
    it('should have recordsPerPage', () => {
      expect(list.recordsPerPage).toBe(list.result.recordsPerPage);
    });
    it('should have unfilteredRecordCount', () => {
      expect(list.unfilteredRecordCount).toBe(list.result.unfilteredRecordCount);
    });
    it('should have filterValues', () => {
      expect(list.filterValues).toEqual(list.result.filterValues);
    });
    it('should have sort', () => {
      expect(list.sort).toEqual(list.result.sort);
    });

  });



  it('should have destroy()', () => {
    expect(recordSubject$.observers.length).toBe(1);
    list.destroy();
    expect(recordSubject$.observers.length).toBe(0);
  });

  it('should recalculate on setPage()', () => {
    let recalculated = 0;
    list.result$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setPage(0);
    expect(recalculated).toBe(2);
  });
  it('should recalculate on setRecordsPerPage()', () => {
    let recalculated = 0;
    list.result$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setRecordsPerPage(0);
    expect(recalculated).toBe(2);
  });

  it('should recalculate on setSort()', () => {
    let recalculated = 0;
    list.result$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setSort({key: 'a', reversed: true});
    expect(recalculated).toBe(2);
  });


  it('should recalculate on setFilterValue()', () => {
    let recalculated = 0;
    list.result$.subscribe(() => recalculated++);
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


  describe('initialization', () => {
    let myInit: any;
    beforeEach(() => {
      myInit = {
        src$: recordSubject$.asObservable(),
        idKey: 'id'
      };
      recordSubject$.next([
        {id: 'a'},
        {id: 'b'},
        {id: 'c'},
        {id: 'd'},
        {id: 'e'},
        {id: 'f'},
      ]);
    });
    it('should set page to 0 if page is missing from the init', () => {
      list = new NgxList(myInit);
      expect(list.result.page).toBe(0);
    });
    it('should set page to 0 if page is less than 0', () => {
      myInit.page = -1773;
      list = new NgxList(myInit);
      expect(list.result.page).toBe(0);
    });
    it('should set page to 0 if page is not an int', () => {
      myInit.page = 'foo';
      list = new NgxList(myInit);
      expect(list.result.page).toBe(0);
    });
    it('should set page to 1 if page is 1 and there are at least 2 pages', () => {
      myInit.page = 1;
      myInit.recordsPerPage = 3;
      list = new NgxList(myInit);
      expect(list.result.page).toBe(1);
    });
    it('should set recordsPerPage to 10 if recordsPerPage is less than 0', () => {
      myInit.recordsPerPage = -1828;
      list = new NgxList(myInit);
      expect(list.result.recordsPerPage).toBe(10);
    });
    it('should set recordsPerPage to an int greater than 0', () => {
      myInit.recordsPerPage = 4;
      list = new NgxList(myInit);
      expect(list.result.recordsPerPage).toBe(4);
    });
    it('should set recordsPerPage to an int === 0', () => {
      myInit.recordsPerPage = 0;
      list = new NgxList(myInit);
      expect(list.result.recordsPerPage).toBe(0);
    });
    it('should set sort if passed  no sort obj', () => {
      list = new NgxList(myInit);
      expect(list.result.sort).toEqual({key: 'id', reversed: false});
    });
    it('should set sort if passed  a complete sort obj', () => {
      myInit.sort = {key: 'foo', reversed: true};
      list = new NgxList(myInit);
      expect(list.result.sort).toEqual({key: 'foo', reversed: true});
    });
    it('should set sort if passed an incomplete sort obj -w/o key', () => {
      myInit.sort = {reversed: true};
      list = new NgxList(myInit);
      expect(list.result.sort).toEqual({key: 'id', reversed: true});
    });
    it('should set sort if passed an incomplete sort obj - w/o reversed', () => {
      myInit.sort = {key: 'foo'};
      list = new NgxList(myInit);
      expect(list.result.sort).toEqual({key: 'foo', reversed: false});
    });
    it('should set filterValues', () => {
      myInit.filterValues = {search: 'foo'};
      list = new NgxList(myInit);
      expect(list.result.filterValues).toEqual({search: 'foo'});
    });
    it('should set the sortFn if passed', () => {
      const sortFn = jasmine.createSpy().and.callFake(() => recordSubject$.value);
      myInit.sortFn = sortFn;
      list = new NgxList(myInit);
      expect(sortFn).toHaveBeenCalled();
    });
    it('should set the sortFn if not passed in init', () => {
      const spy = spyOn(NgxListFnFactory, 'sortFn').and.callThrough();
      list = new NgxList(myInit);
      expect(spy).toHaveBeenCalled();
    });

    it('should set filters', () => {
      const spy1 = jasmine.createSpy().and.returnValue([]);
      const spy2 = jasmine.createSpy().and.returnValue([]);
      myInit.filters = {
        foo: spy1,
        bar: spy2
      };
      list = new NgxList(myInit);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

});
