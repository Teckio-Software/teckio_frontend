import { TestBed } from '@angular/core/testing';

import { CuentabancariaServiceService } from './cuentabancaria-service.service';

describe('CuentabancariaServiceService', () => {
  let service: CuentabancariaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentabancariaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
