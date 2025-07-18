import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClienteCuentascontablesComponent } from './modal-cliente-cuentascontables.component';

describe('ModalClienteCuentascontablesComponent', () => {
  let component: ModalClienteCuentascontablesComponent;
  let fixture: ComponentFixture<ModalClienteCuentascontablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalClienteCuentascontablesComponent]
    });
    fixture = TestBed.createComponent(ModalClienteCuentascontablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
