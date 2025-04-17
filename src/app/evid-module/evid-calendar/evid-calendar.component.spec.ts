import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvidCalendarComponent } from './evid-calendar.component';

describe('EvidCalendarComponent', () => {
  let component: EvidCalendarComponent;
  let fixture: ComponentFixture<EvidCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
