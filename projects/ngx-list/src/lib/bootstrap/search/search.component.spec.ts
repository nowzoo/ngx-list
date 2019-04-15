import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgxList } from '../../list';
import { NgxListResult } from '../../shared';
import { NgxListBootstrapSearchComponent } from './search.component';
import {
  INgxListBoostrapOptions,
  NGX_LIST_BOOTSTRAP_OPTIONS,
  NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS
} from '../options';

describe('from provider', () => {
  let component: NgxListBootstrapSearchComponent;
  let fixture: ComponentFixture<NgxListBootstrapSearchComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;
  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapSearchComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: NGX_LIST_BOOTSTRAP_OPTIONS, useValue: {
          searchPlaceholder: 'foo'
        }}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(NgxListBootstrapSearchComponent);
    component = fixture.componentInstance;
    component.list = list;
    component.filterKey = 'search';
  });
  it('should pick up the options from provider', () => {
    expect(component.normalizedOptions.searchPlaceholder).toBe('foo');
  });
});

describe('NgxListBootstrapSearchComponent', () => {
  let component: NgxListBootstrapSearchComponent;
  let fixture: ComponentFixture<NgxListBootstrapSearchComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;

  beforeEach(async(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapSearchComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListBootstrapSearchComponent);
    component = fixture.componentInstance;
    component.list = list;
    component.filterKey = 'search';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('get normalizedOptions', () => {
    it('should have normalizedOptions', () => {
      expect(component.normalizedOptions).toBeTruthy();
      expect(component.normalizedOptions).toEqual(NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS);
    });
    it('should pick up the options passed', () => {
      component.options = {
        searchPlaceholder: 'foo'
      };
      expect(component.normalizedOptions.searchPlaceholder).toBe('foo');
    });
  });
  describe('ngOnInit() and ngOnDestroy()', () => {
    it('should sub and unsub', () => {
      const subj$ = new BehaviorSubject({} as any);
      spyOnProperty(component.list, 'results$').and.returnValue(subj$.asObservable());
      component.ngOnInit();
      expect(subj$.observers.length).toBe(0);
    });
    it('should set the control value', () => {
      component.ngOnInit();
      expect(component.control.value).toBe('');
    });
    it('should set the control value to whatever the filter value is', () => {
      list.setFilterValue('search', 'foo');
      component.ngOnInit();
      expect(component.control.value).toBe('foo');
    });
    it('should call onControlValueChange when the value changes', fakeAsync(() => {
      spyOn(component, 'onControlValueChange').and.callThrough();
      component.ngOnInit();
      component.control.setValue('foo');
      tick();
      expect(component.onControlValueChange).toHaveBeenCalledWith('foo');
    }));
    it('should call onControlValueChange when the value changes if debounce is set', fakeAsync(() => {
      spyOn(component, 'onControlValueChange').and.callThrough();
      component.debounce = 250;
      component.ngOnInit();
      component.control.setValue('foo');
      tick(249);
      expect(component.onControlValueChange).not.toHaveBeenCalled();
      tick(20);
      expect(component.onControlValueChange).toHaveBeenCalledWith('foo');
    }));
  });

});
