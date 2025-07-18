import { TestBed } from '@angular/core/testing';

import { CuentabancariaEmpresaService } from './cuentabancaria-empresa.service';

describe('CuentabancariaEmpresaService', () => {
  let service: CuentabancariaEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentabancariaEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
