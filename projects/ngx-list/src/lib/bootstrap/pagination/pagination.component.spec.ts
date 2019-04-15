import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxListBoostrapPaginationComponent } from './pagination.component';

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
  let component: NgxListBoostrapPaginationComponent;
  let fixture: ComponentFixture<NgxListBoostrapPaginationComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;

  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBoostrapPaginationComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: NGX_LIST_BOOTSTRAP_OPTIONS, useValue: {recordsPerPageNoPagingLabel: 'w'}}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(NgxListBoostrapPaginationComponent);
    component = fixture.componentInstance;
    component.list = list;
  });
  it('pick up options passed in provider ', () => {
    expect(component.normalizedOptions.recordsPerPageNoPagingLabel).toEqual('w');
  });
});


describe('NgxListBoostrapPaginationComponent', () => {
  let component: NgxListBoostrapPaginationComponent;
  let fixture: ComponentFixture<NgxListBoostrapPaginationComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;

  beforeEach(async(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBoostrapPaginationComponent ],
      imports: [ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListBoostrapPaginationComponent);
    component = fixture.componentInstance;
    component.list = list;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('update recordsPerPage', () => {
    it('should page', () => {
      spyOn(list, 'setPage').and.callThrough();
      component.control.setValue(233);
      expect(list.setPage).toHaveBeenCalledWith(233);
    });
  });

  describe('updateControl', () => {
    it('should set prevDisabled', () => {
      component.updateControl({page: 0, pageCount: 22} as any);
      expect(component.prevDisabled).toBe(true);
      component.updateControl({page: 2, pageCount: 22} as any);
      expect(component.prevDisabled).toBe(false);

    });
    it('should set nextDisabled', () => {
      component.updateControl({page: 21, pageCount: 22} as any);
      expect(component.nextDisabled).toBe(true);
      component.updateControl({page: 20, pageCount: 22} as any);
      expect(component.nextDisabled).toBe(false);

    });
  });
});
