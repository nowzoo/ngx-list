import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxListBootstrapSearchControlComponent } from './search-control.component';

describe('NgxListBootstrapSearchControlComponent', () => {
  let component: NgxListBootstrapSearchControlComponent;
  let fixture: ComponentFixture<NgxListBootstrapSearchControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapSearchControlComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListBootstrapSearchControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
