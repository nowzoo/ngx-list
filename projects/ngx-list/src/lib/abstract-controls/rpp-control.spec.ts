import { NgxListAbstractRppControl } from './rpp-control';
import { BehaviorSubject } from 'rxjs';
import { NgxList } from '../list';
import { NgxListResult } from '../shared';
import { FormControl } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';


describe('NgxListAbstractRppControl', () => {
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;
  let rppControl: NgxListAbstractRppControl;
  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable()});
    rppControl = new NgxListAbstractRppControl();
    rppControl.list = list;
  });
  it('should create an instance', () => {
    expect(rppControl).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(rppControl, 'onFirstResult');
    });
    it('should call onFirstResult', () => {
      rppControl.ngOnInit();
      expect(rppControl.onFirstResult).toHaveBeenCalled();
    });
    it('should create the control', () => {
      rppControl.ngOnInit();
      expect(rppControl.control).toBeTruthy();
    });
  });

  describe('onFirstResult(result)', () => {
    let fc: FormControl;
    let result: NgxListResult;
    beforeEach(() => {
      fc = new FormControl('');
      spyOn(rppControl, 'onControlValueChange');
      spyOn(fc, 'setValue').and.callThrough();
      spyOnProperty(rppControl, 'control').and.returnValue(fc);
      result = {records: [], recordCount: 0, filterParams: {}, page: 0, recordsPerPage: 0, pageCount: 0,
        sortColumn: 'foo', sortReversed: false, unfilteredRecordCount: 0};
    });
    it('should set the control value', () => {
      result.recordsPerPage = 0;
      rppControl.onFirstResult(result);
      expect(fc.setValue).toHaveBeenCalledWith(0);
    });

    it('should start listening to the control, and call onControlValueChange when it changes', fakeAsync(() => {
      result.filterParams = {search: ''};
      rppControl.onFirstResult(result);
      fc.setValue('foo');
      tick();
      expect(rppControl.onControlValueChange).toHaveBeenCalledWith('foo');
    }));


  });
});
