import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteEntradaAlmacenComponent } from './ajuste-entrada-almacen.component';

describe('AjusteEntradaAlmacenComponent', () => {
  let component: AjusteEntradaAlmacenComponent;
  let fixture: ComponentFixture<AjusteEntradaAlmacenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjusteEntradaAlmacenComponent]
    });
    fixture = TestBed.createComponent(AjusteEntradaAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
