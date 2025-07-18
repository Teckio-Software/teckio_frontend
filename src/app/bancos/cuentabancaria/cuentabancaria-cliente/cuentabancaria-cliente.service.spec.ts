import { TestBed } from '@angular/core/testing';

import { CuentabancariaClienteService } from './cuentabancaria-cliente.service';

describe('CuentabancariaClienteService', () => {
  let service: CuentabancariaClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentabancariaClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
