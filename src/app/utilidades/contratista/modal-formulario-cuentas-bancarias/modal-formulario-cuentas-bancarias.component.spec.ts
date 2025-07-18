import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormularioCuentasBancariasComponent } from './modal-formulario-cuentas-bancarias.component';

describe('ModalFormularioCuentasBancariasComponent', () => {
  let component: ModalFormularioCuentasBancariasComponent;
  let fixture: ComponentFixture<ModalFormularioCuentasBancariasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormularioCuentasBancariasComponent]
    });
    fixture = TestBed.createComponent(ModalFormularioCuentasBancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
