import { TestBed } from '@angular/core/testing';

import { IndirectosConceptoService } from './indirectos-concepto.service';

describe('IndirectosConceptoService', () => {
  let service: IndirectosConceptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndirectosConceptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
