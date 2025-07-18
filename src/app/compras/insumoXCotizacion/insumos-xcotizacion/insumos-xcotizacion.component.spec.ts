import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosXcotizacionComponent } from './insumos-xcotizacion.component';

describe('InsumosXcotizacionComponent', () => {
  let component: InsumosXcotizacionComponent;
  let fixture: ComponentFixture<InsumosXcotizacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsumosXcotizacionComponent]
    });
    fixture = TestBed.createComponent(InsumosXcotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
