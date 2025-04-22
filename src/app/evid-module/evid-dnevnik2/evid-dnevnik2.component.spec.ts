import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidDnevnik2Component } from './evid-dnevnik2.component';

describe('EvidDnevnik2Component', () => {
  let component: EvidDnevnik2Component;
  let fixture: ComponentFixture<EvidDnevnik2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidDnevnik2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidDnevnik2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
