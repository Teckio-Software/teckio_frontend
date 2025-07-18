import { TestBed } from '@angular/core/testing';

import { EmpleadoPreciounitarioService } from './empleado-preciounitario.service';

describe('EmpleadoPreciounitarioService', () => {
  let service: EmpleadoPreciounitarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpleadoPreciounitarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
