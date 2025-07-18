import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaBancariaEmpresaComponent } from './cuenta-bancaria-empresa.component';

describe('CuentaBancariaEmpresaComponent', () => {
  let component: CuentaBancariaEmpresaComponent;
  let fixture: ComponentFixture<CuentaBancariaEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentaBancariaEmpresaComponent]
    });
    fixture = TestBed.createComponent(CuentaBancariaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
