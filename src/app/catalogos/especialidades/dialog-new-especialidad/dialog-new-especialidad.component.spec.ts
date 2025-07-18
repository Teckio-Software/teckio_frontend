import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewEspecialidadComponent } from './dialog-new-especialidad.component';

describe('DialogNewEspecialidadComponent', () => {
  let component: DialogNewEspecialidadComponent;
  let fixture: ComponentFixture<DialogNewEspecialidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewEspecialidadComponent]
    });
    fixture = TestBed.createComponent(DialogNewEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
