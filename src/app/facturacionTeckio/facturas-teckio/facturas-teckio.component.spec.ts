import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasTeckioComponent } from './facturas-teckio.component';

describe('FacturasTeckioComponent', () => {
  let component: FacturasTeckioComponent;
  let fixture: ComponentFixture<FacturasTeckioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturasTeckioComponent]
    });
    fixture = TestBed.createComponent(FacturasTeckioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
