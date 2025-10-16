import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasPorPagarComponent } from './cuentas-por-pagar.component';

describe('CuentasPorPagarComponent', () => {
  let component: CuentasPorPagarComponent;
  let fixture: ComponentFixture<CuentasPorPagarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentasPorPagarComponent]
    });
    fixture = TestBed.createComponent(CuentasPorPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
