import { TestBed } from '@angular/core/testing';

import { ConjuntoIndirectosService } from './conjunto-indirectos.service';

describe('ConjuntoIndirectosService', () => {
  let service: ConjuntoIndirectosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConjuntoIndirectosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
