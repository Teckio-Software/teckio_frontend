import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesExistenciaComponent } from './detalles-existencia.component';

describe('DetallesExistenciaComponent', () => {
  let component: DetallesExistenciaComponent;
  let fixture: ComponentFixture<DetallesExistenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesExistenciaComponent]
    });
    fixture = TestBed.createComponent(DetallesExistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
