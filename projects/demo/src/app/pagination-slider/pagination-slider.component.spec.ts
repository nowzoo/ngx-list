import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
