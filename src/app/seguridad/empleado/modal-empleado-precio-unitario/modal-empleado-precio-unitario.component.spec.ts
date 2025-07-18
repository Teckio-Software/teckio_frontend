import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmpleadoPrecioUnitarioComponent } from './modal-empleado-precio-unitario.component';

describe('ModalEmpleadoPrecioUnitarioComponent', () => {
  let component: ModalEmpleadoPrecioUnitarioComponent;
  let fixture: ComponentFixture<ModalEmpleadoPrecioUnitarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEmpleadoPrecioUnitarioComponent]
    });
    fixture = TestBed.createComponent(ModalEmpleadoPrecioUnitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
