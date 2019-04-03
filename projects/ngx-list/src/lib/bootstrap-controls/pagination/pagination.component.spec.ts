import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { PaginationComponent } from './pagination.component';
import { NGX_LIST_PAGINATION_LABELS } from '../options';

describe('providing a NGX_LIST_PAGINATION_LABELS provider', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationComponent ],
      providers: [
        {provide: NGX_LIST_PAGINATION_LABELS, useValue: {currentTitle: 'Foo Bar'}}
      ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });
  it('should use the provided labels', () => {
    component.labels = null;
    expect(component.normalizedLabels).not.toBe(null);
    component.labels = {nextHTML: 'foo'};
    expect(component.normalizedLabels.currentTitle).toEqual('Foo Bar');
  });

});
describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should normalize labels', () => {
      component.labels = null;
      expect(component.normalizedLabels).not.toBe(null);
      component.labels = {nextHTML: 'foo'};
      expect(component.normalizedLabels.nextHTML).toEqual('foo');
    });
  });

  describe('ngOnInit, ngOnChanges, ngOnDestroy', () => {
    let list: any;
    let subj$: BehaviorSubject<any>;
    beforeEach(() => {
      spyOn(component, 'updateButtons');
      subj$ = new BehaviorSubject({page: 22});
      list = {results$: subj$.asObservable()};
      component.list = list;
    });
    it('should sub and unsub', () => {
      expect(subj$.observers.length).toBe(0);
      component.ngOnInit();
      expect(subj$.observers.length).toBe(2); // the parent and the child
      component.ngOnDestroy();
      expect(subj$.observers.length).toBe(0);
    });
    it('should update the buttons', () => {
      component.ngOnInit();
      expect(component.updateButtons).toHaveBeenCalled();
    });
    it('should update the buttons on changes', () => {
      component.ngOnChanges();
      expect(component.updateButtons).toHaveBeenCalled();
    });
  });
  describe('setPage', () => {
    let list: any;
    let event: any;
    beforeEach(() => {
      event = {preventDefault: jasmine.createSpy()};
      list = {setPage: jasmine.createSpy()};
      component.list = list;
    });
    it('should call event.preventDefault', () => {
      component.setPage(2, event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
    it('should call list.setPage', () => {
      component.setPage(2, event);
      expect(list.setPage).toHaveBeenCalledWith(2);
    });
  });

  describe('updateButtons()', () => {
    it('should have no adj buttons if maxAdjacent is 0', () => {
      component.maxAdjacent = 0;
      component.result = {page: 10, pageCount: 22} as any;
      component.updateButtons();
      expect(component.btns).toEqual([10]);
    });
    it('should have no buttons if result is null', () => {
      component.maxAdjacent = 10;
      component.result = null;
      component.updateButtons();
      expect(component.btns).toEqual([]);
    });
    it('should have no buttons if result.pageCount is 0', () => {
      component.maxAdjacent = 10;
      component.result = {pageCount: 0} as any;
      component.updateButtons();
      expect(component.btns).toEqual([]);
    });
    it('should have two adj buttons if maxAdjacent is 1', () => {
      component.maxAdjacent = 1;
      component.result = {page: 10, pageCount: 22} as any;
      component.updateButtons();
      expect(component.btns).toEqual([9, 10, 11]);
    });
    it('should deal with page being 0', () => {
      component.maxAdjacent = 3;
      component.result = {page: 0, pageCount: 22} as any;
      component.updateButtons();
      expect(component.btns).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });
    it('should deal with page being 0 with a pageCount less than maxAdjacent * 2', () => {
      component.maxAdjacent = 3;
      component.result = {page: 0, pageCount: 4} as any;
      component.updateButtons();
      expect(component.btns).toEqual([0, 1, 2, 3]);
    });

    it('should deal with page being the last', () => {
      component.maxAdjacent = 3;
      component.result = {page: 21, pageCount: 22} as any;
      component.updateButtons();
      expect(component.btns).toEqual([15, 16, 17, 18, 19, 20, 21]);
    });
    it('should deal with a few number of pages', () => {
      component.maxAdjacent = 30;
      component.result = {page: 3, pageCount: 6} as any;
      component.updateButtons();
      expect(component.btns).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });
});
