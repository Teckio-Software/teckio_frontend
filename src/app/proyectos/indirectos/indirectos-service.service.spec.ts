import { TestBed } from '@angular/core/testing';

import { IndirectosServiceService } from './indirectos-service.service';

describe('IndirectosServiceService', () => {
  let service: IndirectosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndirectosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
