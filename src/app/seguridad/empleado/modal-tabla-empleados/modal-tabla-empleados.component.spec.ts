import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTablaEmpleadosComponent } from './modal-tabla-empleados.component';

describe('ModalTablaEmpleadosComponent', () => {
  let component: ModalTablaEmpleadosComponent;
  let fixture: ComponentFixture<ModalTablaEmpleadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTablaEmpleadosComponent]
    });
    fixture = TestBed.createComponent(ModalTablaEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
