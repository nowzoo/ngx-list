import { BehaviorSubject } from 'rxjs';
import {
  NgxListRecord,
  NgxListInit
} from './shared';
import { NgxList } from './list';




describe('NgxList', () => {
  let recordSubject$: BehaviorSubject<NgxListRecord[]>;
  let init: NgxListInit;
  let list: NgxList;
  beforeEach(() => {
    recordSubject$ = new BehaviorSubject([]);
    init = {
      src$: recordSubject$.asObservable()
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
    it('should have filterParams', () => {
      expect(list.filterParams).toBe(list.currentResult.filterParams);
    });
    it('should have sortColumn', () => {
      expect(list.sortColumn).toBe(list.currentResult.sortColumn);
    });
    it('should have sortReversed', () => {
      expect(list.sortReversed).toBe(list.currentResult.sortReversed);
    });
    it('should have paused', () => {
      expect(list.paused).toBe(false);
      init.initiallyPaused = true;
      list = new NgxList(init);
      expect(list.paused).toBe(true);
    });
    it('should have sortFn', () => {
      expect(list.sortFn).toEqual(jasmine.any(Function));
      init.sortFn = (records) => records;
      list = new NgxList(init);
      expect(list.sortFn).toBe(init.sortFn);
    });
    it('should have filters', () => {
      expect(list.filters).toEqual([]);
      init.filters = [(records) => records];
      list = new NgxList(init);
      expect(list.filters).toBe(init.filters);
    });
  });

  it('should have start() and stop()', () => {
    expect(list.paused).toBe(false);
    expect(recordSubject$.observers.length).toBe(1);
    list.stop();
    expect(list.paused).toBe(true);
    expect(recordSubject$.observers.length).toBe(1);
    list.start();
    expect(list.paused).toBe(false);
    expect(recordSubject$.observers.length).toBe(1);
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
    list.setSort('a', true);
    expect(recalculated).toBe(2);
  });

  it('should recalculate on setFilterParams()', () => {
    let recalculated = 0;
    list.results$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setFilterParams({});
    expect(recalculated).toBe(2);
  });
  it('should recalculate on setFilterParam()', () => {
    let recalculated = 0;
    list.results$.subscribe(() => recalculated++);
    expect(recalculated).toBe(1);
    list.setFilterParam('foo', 22);
    expect(recalculated).toBe(2);
  });

  describe('setFilterParam', () => {
    it('should not delete the filterParam key if passed null', () => {
      list.setFilterParam('foo', 22);
      expect(list.filterParams.foo).toBe(22);
      list.setFilterParam('foo', null);
      expect(list.filterParams.foo).toBe(null);
    });

    it('should delete the filterParam key if passed undefined', () => {
      list.setFilterParam('foo', 22);
      expect(list.filterParams.foo).toBe(22);
      list.setFilterParam('foo', undefined);
      expect(list.filterParams.foo).toBe(undefined);
    });
  });

  describe('setFilterParams', () => {
    it('should set the params to an empty object if passed null', () => {
      list.setFilterParams(null);
      expect(list.filterParams).toEqual({});
    });
    it('should set the params if passed an obj', () => {
      list.setFilterParams({foo: 22});
      expect(list.filterParams).toEqual({foo: 22});
    });
  });






});
