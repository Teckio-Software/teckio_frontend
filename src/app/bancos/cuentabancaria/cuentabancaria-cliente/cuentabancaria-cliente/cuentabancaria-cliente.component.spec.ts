import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentabancariaClienteComponent } from './cuentabancaria-cliente.component';

describe('CuentabancariaClienteComponent', () => {
  let component: CuentabancariaClienteComponent;
  let fixture: ComponentFixture<CuentabancariaClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentabancariaClienteComponent]
    });
    fixture = TestBed.createComponent(CuentabancariaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
