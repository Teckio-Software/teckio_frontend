import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaComplementoPagoComponent } from './factura-complemento-pago.component';

describe('FacturaComplementoPagoComponent', () => {
  let component: FacturaComplementoPagoComponent;
  let fixture: ComponentFixture<FacturaComplementoPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturaComplementoPagoComponent]
    });
    fixture = TestBed.createComponent(FacturaComplementoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
