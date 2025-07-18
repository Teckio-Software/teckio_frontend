import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenSalidaInsumosComponent } from './almacen-salida-insumos.component';

describe('AlmacenSalidaInsumosComponent', () => {
  let component: AlmacenSalidaInsumosComponent;
  let fixture: ComponentFixture<AlmacenSalidaInsumosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmacenSalidaInsumosComponent]
    });
    fixture = TestBed.createComponent(AlmacenSalidaInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
