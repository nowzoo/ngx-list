import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxListBootstrapSortLinkComponent } from './sort-link.component';

describe('NgxListBootstrapSortLinkComponent', () => {
  let component: NgxListBootstrapSortLinkComponent;
  let fixture: ComponentFixture<NgxListBootstrapSortLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapSortLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListBootstrapSortLinkComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
