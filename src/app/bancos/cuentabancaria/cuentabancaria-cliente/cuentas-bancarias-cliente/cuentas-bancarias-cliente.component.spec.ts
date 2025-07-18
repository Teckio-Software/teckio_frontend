import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasBancariasClienteComponent } from './cuentas-bancarias-cliente.component';

describe('CuentasBancariasClienteComponent', () => {
  let component: CuentasBancariasClienteComponent;
  let fixture: ComponentFixture<CuentasBancariasClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentasBancariasClienteComponent]
    });
    fixture = TestBed.createComponent(CuentasBancariasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
