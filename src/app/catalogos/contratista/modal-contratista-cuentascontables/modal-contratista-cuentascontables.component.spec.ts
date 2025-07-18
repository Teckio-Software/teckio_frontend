import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContratistaCuentascontablesComponent } from './modal-contratista-cuentascontables.component';

describe('ModalContratistaCuentascontablesComponent', () => {
  let component: ModalContratistaCuentascontablesComponent;
  let fixture: ComponentFixture<ModalContratistaCuentascontablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalContratistaCuentascontablesComponent]
    });
    fixture = TestBed.createComponent(ModalContratistaCuentascontablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
