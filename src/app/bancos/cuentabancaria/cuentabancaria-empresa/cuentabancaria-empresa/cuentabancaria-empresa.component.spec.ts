import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentabancariaEmpresaComponent } from './cuentabancaria-empresa.component';

describe('CuentabancariaEmpresaComponent', () => {
  let component: CuentabancariaEmpresaComponent;
  let fixture: ComponentFixture<CuentabancariaEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentabancariaEmpresaComponent]
    });
    fixture = TestBed.createComponent(CuentabancariaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
