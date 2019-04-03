import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { PaginationSliderComponent } from './pagination-slider.component';

describe('PaginationSliderComponent', () => {
  let component: PaginationSliderComponent;
  let fixture: ComponentFixture<PaginationSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationSliderComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let inp: HTMLInputElement;
    let list: any;
    let subj$: BehaviorSubject<any>;
    beforeEach(() => {
      subj$ = new BehaviorSubject({page: 22});
      list = {results$: subj$.asObservable()};
      component.list = list;
      inp = document.createElement('input');
      inp.value = '0';
      spyOnProperty(component, 'pageInput').and.returnValue(inp);
    });
    it('should sub and unsub', () => {
      expect(subj$.observers.length).toBe(0);
      component.ngOnInit();
      expect(subj$.observers.length).toBe(2); // the parent and the child
      component.ngOnDestroy();
      expect(subj$.observers.length).toBe(0);
    });
    it('should set thge input value', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(inp.value).toBe('22');
      subj$.next({page: 44});
      tick();
      expect(inp.value).toBe('44');
    }));

  });

  describe('onRangeInput', () => {
    let inp: HTMLInputElement;
    beforeEach(() => {
      inp = document.createElement('input');
      inp.value = '0';
      spyOnProperty(component, 'pageInput').and.returnValue(inp);
    });
    it('should set sliderPage', () => {
      expect(component.sliderPage).toBe(-1);
      component.onRangeInput();
      expect(component.sliderPage).toBe(0);
      inp.value = '33';
      component.onRangeInput();
      expect(component.sliderPage).toBe(33);
    });
    it('should set sliding to true', () => {
      expect(component.sliding).toBe(false);
      component.onRangeInput();
      expect(component.sliding).toBe(true);
    });
  });

  describe('onRangeChange', () => {
    let inp: HTMLInputElement;
    let list: any;
    beforeEach(() => {
      list = {setPage: jasmine.createSpy()};
      component.list = list;
      inp = document.createElement('input');
      inp.value = '33';
      spyOnProperty(component, 'pageInput').and.returnValue(inp);
    });
    it('should set sliderPage to -1', () => {
      expect(component.sliderPage).toBe(-1);
      component.onRangeInput();
      expect(component.sliderPage).toBe(33);
      component.onRangeChange();
      expect(component.sliderPage).toBe(-1);
    });
    it('should set sliding to false', () => {
      expect(component.sliding).toBe(false);
      component.onRangeInput();
      expect(component.sliding).toBe(true);
      component.onRangeChange();
      expect(component.sliding).toBe(false);
    });
    it('should call list.setPage', () => {
      component.onRangeChange();
      expect(list.setPage).toHaveBeenCalledWith(33);
    });
  });
});
