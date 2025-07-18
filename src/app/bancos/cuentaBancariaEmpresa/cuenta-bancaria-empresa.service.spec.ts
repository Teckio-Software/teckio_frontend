import { TestBed } from '@angular/core/testing';

import { CuentaBancariaEmpresaService } from './cuenta-bancaria-empresa.service';

describe('CuentaBancariaEmpresaService', () => {
  let service: CuentaBancariaEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentaBancariaEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
