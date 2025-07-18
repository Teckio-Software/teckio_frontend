import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenOrdenesCompraComponent } from './resumen-ordenes-compra.component';

describe('ResumenOrdenesCompraComponent', () => {
  let component: ResumenOrdenesCompraComponent;
  let fixture: ComponentFixture<ResumenOrdenesCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenOrdenesCompraComponent]
    });
    fixture = TestBed.createComponent(ResumenOrdenesCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
