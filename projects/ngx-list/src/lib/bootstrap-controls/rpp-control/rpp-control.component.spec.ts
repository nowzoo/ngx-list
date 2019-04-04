import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxListBootstrapRppControlComponent } from './rpp-control.component';

describe('NgxListBootstrapRppControlComponent', () => {
  let component: NgxListBootstrapRppControlComponent;
  let fixture: ComponentFixture<NgxListBootstrapRppControlComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxListBootstrapRppControlComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListBootstrapRppControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
