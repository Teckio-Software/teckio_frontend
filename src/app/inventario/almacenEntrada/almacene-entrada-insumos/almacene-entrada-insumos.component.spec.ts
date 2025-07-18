import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmaceneEntradaInsumosComponent } from './almacene-entrada-insumos.component';

describe('AlmaceneEntradaInsumosComponent', () => {
  let component: AlmaceneEntradaInsumosComponent;
  let fixture: ComponentFixture<AlmaceneEntradaInsumosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmaceneEntradaInsumosComponent]
    });
    fixture = TestBed.createComponent(AlmaceneEntradaInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
