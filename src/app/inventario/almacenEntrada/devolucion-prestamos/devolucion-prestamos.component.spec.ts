import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionPrestamosComponent } from './devolucion-prestamos.component';

describe('DevolucionPrestamosComponent', () => {
  let component: DevolucionPrestamosComponent;
  let fixture: ComponentFixture<DevolucionPrestamosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevolucionPrestamosComponent]
    });
    fixture = TestBed.createComponent(DevolucionPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
