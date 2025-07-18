import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrdenCompraComponent } from './modal-orden-compra.component';

describe('ModalOrdenCompraComponent', () => {
  let component: ModalOrdenCompraComponent;
  let fixture: ComponentFixture<ModalOrdenCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalOrdenCompraComponent]
    });
    fixture = TestBed.createComponent(ModalOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
