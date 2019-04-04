import { NgxListAbstractSearchControl } from './search-control';
import { BehaviorSubject } from 'rxjs';
import { NgxList } from '../list';
import { NgxListResult } from '../shared';
import { FormControl } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';

describe('SearchControl', () => {
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;
  let searchControl: NgxListAbstractSearchControl;

  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable()});
    searchControl = new NgxListAbstractSearchControl();
    searchControl.list = list;
    searchControl.filterKey = 'search';
  });
  it('should create an instance', () => {
    expect(new NgxListAbstractSearchControl()).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(searchControl, 'onFirstResult');
    });
    it('should call onFirstResult', () => {
      searchControl.ngOnInit();
      expect(searchControl.onFirstResult).toHaveBeenCalled();
    });
    it('should create the control', () => {
      searchControl.ngOnInit();
      expect(searchControl.control).toBeTruthy();
    });
  });

  describe('onFirstResult(result)', () => {
    let fc: FormControl;
    let result: NgxListResult;
    beforeEach(() => {
      fc = new FormControl('');
      spyOn(searchControl, 'onControlValueChange');
      spyOn(fc, 'setValue').and.callThrough();
      spyOnProperty(searchControl, 'control').and.returnValue(fc);
      result = {records: [], recordCount: 0, filterParams: {}, page: 0, recordsPerPage: 0, pageCount: 0,
        sortColumn: 'foo', sortReversed: false, unfilteredRecordCount: 0};
    });
    it('should set the control value to an empty string if the filter param is missing', () => {
      result.filterParams = {};
      searchControl.onFirstResult(result);
      expect(fc.setValue).toHaveBeenCalledWith('');
    });
    it('should set the control value to an empty string if the filter param is not a string', () => {
      result.filterParams = {search: {}};
      searchControl.onFirstResult(result);
      expect(fc.setValue).toHaveBeenCalledWith('');
    });
    it('should set the control value to the string if the filter param is a string', () => {
      result.filterParams = {search: 'yayy'};
      searchControl.onFirstResult(result);
      expect(fc.setValue).toHaveBeenCalledWith('yayy');
    });
    it('should start listening to the control, and call onControlValueChange when it changes', fakeAsync(() => {
      result.filterParams = {search: ''};
      searchControl.onFirstResult(result);
      fc.setValue('foo');
      tick();
      expect(searchControl.onControlValueChange).toHaveBeenCalledWith('foo');
    }));
    it('should debounce the changes if debounce > 0', fakeAsync(() => {
      result.filterParams = {search: ''};
      searchControl.debounce = 1000;
      searchControl.onFirstResult(result);
      fc.setValue('foo');
      tick(999);
      expect(searchControl.onControlValueChange).not.toHaveBeenCalledWith('foo');
      tick(1);
      expect(searchControl.onControlValueChange).toHaveBeenCalledWith('foo');
    }));

  });

  describe('onControlValueChange(value)', () => {
    beforeEach(() => {
      spyOn(list, 'setFilterParam');
    });

    it('should call setFilterParam', () => {
      searchControl.onControlValueChange('foo');
      expect(list.setFilterParam).toHaveBeenCalledWith('search', 'foo');
    });
  });


});
