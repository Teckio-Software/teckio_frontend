import { TestBed } from '@angular/core/testing';

import { CuentabancariaContratistaService } from './cuentabancaria-contratista.service';

describe('CuentabancariaContratistaService', () => {
  let service: CuentabancariaContratistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentabancariaContratistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
