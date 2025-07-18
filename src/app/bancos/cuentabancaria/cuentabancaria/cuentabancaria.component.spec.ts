import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentabancariaComponent } from './cuentabancaria.component';

describe('CuentabancariaComponent', () => {
  let component: CuentabancariaComponent;
  let fixture: ComponentFixture<CuentabancariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentabancariaComponent]
    });
    fixture = TestBed.createComponent(CuentabancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
