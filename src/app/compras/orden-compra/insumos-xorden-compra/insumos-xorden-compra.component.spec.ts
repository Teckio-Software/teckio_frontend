import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosXordenCompraComponent } from './insumos-xorden-compra.component';

describe('InsumosXordenCompraComponent', () => {
  let component: InsumosXordenCompraComponent;
  let fixture: ComponentFixture<InsumosXordenCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsumosXordenCompraComponent]
    });
    fixture = TestBed.createComponent(InsumosXordenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
