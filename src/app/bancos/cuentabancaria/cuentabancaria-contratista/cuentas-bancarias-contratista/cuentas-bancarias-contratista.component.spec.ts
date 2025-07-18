import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasBancariasContratistaComponent } from './cuentas-bancarias-contratista.component';

describe('CuentasBancariasContratistaComponent', () => {
  let component: CuentasBancariasContratistaComponent;
  let fixture: ComponentFixture<CuentasBancariasContratistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentasBancariasContratistaComponent]
    });
    fixture = TestBed.createComponent(CuentasBancariasContratistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
