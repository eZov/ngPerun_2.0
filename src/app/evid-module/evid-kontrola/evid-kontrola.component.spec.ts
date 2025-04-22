import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvidKontrolaComponent } from './evid-kontrola.component';

describe('EvidKontrolaComponent', () => {
  let component: EvidKontrolaComponent;
  let fixture: ComponentFixture<EvidKontrolaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidKontrolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidKontrolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
