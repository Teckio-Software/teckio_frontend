import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolizaModalComponent } from './poliza-modal.component';

describe('PolizaModalComponent', () => {
  let component: PolizaModalComponent;
  let fixture: ComponentFixture<PolizaModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolizaModalComponent]
    });
    fixture = TestBed.createComponent(PolizaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
