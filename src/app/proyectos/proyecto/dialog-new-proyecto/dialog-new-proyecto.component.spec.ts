import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewProyectoComponent } from './dialog-new-proyecto.component';

describe('DialogNewProyectoComponent', () => {
  let component: DialogNewProyectoComponent;
  let fixture: ComponentFixture<DialogNewProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewProyectoComponent]
    });
    fixture = TestBed.createComponent(DialogNewProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
