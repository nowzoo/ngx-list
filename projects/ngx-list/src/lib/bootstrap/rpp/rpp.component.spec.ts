import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxListBoostrapRppComponent } from './rpp.component';

import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgxList } from '../../list';
import { INgxListResult } from '../../shared';
import {
  INgxListBoostrapOptions,
  NGX_LIST_BOOTSTRAP_OPTIONS,
  NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS
} from '../options';


describe('picking up default options', () => {
  let component: NgxListBoostrapRppComponent;
  let fixture: ComponentFixture<NgxListBoostrapRppComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;

  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBoostrapRppComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: NGX_LIST_BOOTSTRAP_OPTIONS, useValue: {recordsPerPageNoPagingLabel: 'w'}}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(NgxListBoostrapRppComponent);
    component = fixture.componentInstance;
    component.list = list;
  });
  it('pick up options passed in provider ', () => {
    expect(component.normalizedOptions.recordsPerPageNoPagingLabel).toEqual('w');
  });
});

describe('NgxListBoostrapRppComponent', () => {
  let component: NgxListBoostrapRppComponent;
  let fixture: ComponentFixture<NgxListBoostrapRppComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;


  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBoostrapRppComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: NGX_LIST_BOOTSTRAP_OPTIONS, useValue: null}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(NgxListBoostrapRppComponent);
    component = fixture.componentInstance;
    component.list = list;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and ngOnDestroy', () => {
    it('should sub and unsub', () => {
      const subj$ = new BehaviorSubject({} as any);
      spyOnProperty(component.list, 'result$').and.returnValue(subj$.asObservable());
      expect(subj$.observers.length).toBe(0);
      component.ngOnInit();
      expect(subj$.observers.length).toBe(1);
      component.ngOnDestroy();
      expect(subj$.observers.length).toBe(0);
    });
  });

  describe('update list', () => {
    beforeEach(() => {
      spyOn(list, 'setRecordsPerPage').and.callThrough();
    });
    it('should update the list when the form control changes', () => {
      component.ngOnInit();
      component.control.setValue(345);
      expect(list.setRecordsPerPage).toHaveBeenCalledWith(345);
    });
  });

  describe('get normalizedOptions', () => {
    it('should just be the defaults if not passed as input', () => {
      expect(component.normalizedOptions).toEqual(NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS);
    });
    it('should pick up the options passed in the input', () => {
      component.options = {recordsPerPageNoPagingLabel: 'waaa'};
      expect(component.normalizedOptions.recordsPerPageNoPagingLabel).toEqual('waaa');
    });
  });
});
