import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxListBootstrapSortComponent } from './sort.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgxList } from '../../list';
import {
  NGX_LIST_BOOTSTRAP_OPTIONS,
} from '../options';


describe('from provider', () => {
  let component: NgxListBootstrapSortComponent;
  let fixture: ComponentFixture<NgxListBootstrapSortComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;
  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapSortComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: NGX_LIST_BOOTSTRAP_OPTIONS, useValue: {
          currentPageTitle: 'foo'
        }}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(NgxListBootstrapSortComponent);
    component = fixture.componentInstance;
    component.list = list;
  });
  it('should pick up the options from provider', () => {
    expect(component.normalizedOptions.currentPageTitle).toBe('foo');
  });
});
describe('NgxListBootstrapSortComponent', () => {
  let component: NgxListBootstrapSortComponent;
  let fixture: ComponentFixture<NgxListBootstrapSortComponent>;
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;

  beforeEach(async(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable(), idKey: 'id'});
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListBootstrapSortComponent);
    component = fixture.componentInstance;
    component.list = list;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateControl', () => {
    beforeEach(() => {
      component.key = 'foo';
      component.defaultReversed = false;
      component.reversed = false;
      component.selected = false;
      component.ngOnInit();
    });
    it('should set selected', () => {
      component.updateControl({sort: {key: 'foo', reversed: false}} as any);
      expect(component.selected).toBe(true);
      component.updateControl({sort: {key: 'bar', reversed: false}} as any);
      expect(component.selected).toBe(false);
    });
  });
  describe('select', () => {
    beforeEach(() => {
      component.key = 'foo';
      component.defaultReversed = false;
      component.reversed = false;
      component.selected = false;
      component.ngOnInit();
      spyOn(component.list, 'setSort').and.callThrough();
    });
    it('should set selected', () => {
      component.select();
      expect(component.list.setSort).toHaveBeenCalledWith({key: 'foo', reversed: false});
    });
    it('should set selected if defaultReversed', () => {
      component.defaultReversed = true;
      component.select();
      expect(component.list.setSort).toHaveBeenCalledWith({key: 'foo', reversed: true});
    });
    it('should set toggle reversed if already selected', () => {
      component.reversed = true;
      component.selected = true;
      component.select();
      expect(component.list.setSort).toHaveBeenCalledWith({key: 'foo', reversed: false});
      component.select();
      expect(component.list.setSort).toHaveBeenCalledWith({key: 'foo', reversed: true});

    });
  });
});
