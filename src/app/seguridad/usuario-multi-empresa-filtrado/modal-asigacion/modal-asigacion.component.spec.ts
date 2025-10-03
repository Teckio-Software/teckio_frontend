import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsigacionComponent } from './modal-asigacion.component';

describe('ModalAsigacionComponent', () => {
  let component: ModalAsigacionComponent;
  let fixture: ComponentFixture<ModalAsigacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAsigacionComponent]
    });
    fixture = TestBed.createComponent(ModalAsigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
