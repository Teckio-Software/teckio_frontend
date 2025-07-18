import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasBancariasEmpresaComponent } from './cuentas-bancarias-empresa.component';

describe('CuentasBancariasEmpresaComponent', () => {
  let component: CuentasBancariasEmpresaComponent;
  let fixture: ComponentFixture<CuentasBancariasEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentasBancariasEmpresaComponent]
    });
    fixture = TestBed.createComponent(CuentasBancariasEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
