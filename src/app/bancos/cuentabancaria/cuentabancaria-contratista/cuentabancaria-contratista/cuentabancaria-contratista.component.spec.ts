import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentabancariaContratistaComponent } from './cuentabancaria-contratista.component';

describe('CuentabancariaContratistaComponent', () => {
  let component: CuentabancariaContratistaComponent;
  let fixture: ComponentFixture<CuentabancariaContratistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentabancariaContratistaComponent]
    });
    fixture = TestBed.createComponent(CuentabancariaContratistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
