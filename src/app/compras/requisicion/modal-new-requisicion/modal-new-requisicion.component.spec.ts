import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewRequisicionComponent } from './modal-new-requisicion.component';

describe('ModalNewRequisicionComponent', () => {
  let component: ModalNewRequisicionComponent;
  let fixture: ComponentFixture<ModalNewRequisicionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNewRequisicionComponent]
    });
    fixture = TestBed.createComponent(ModalNewRequisicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 