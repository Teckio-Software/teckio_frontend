import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenesSalidasComponent } from './almacenes-salidas.component';

describe('AlmacenesSalidasComponent', () => {
  let component: AlmacenesSalidasComponent;
  let fixture: ComponentFixture<AlmacenesSalidasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmacenesSalidasComponent]
    });
    fixture = TestBed.createComponent(AlmacenesSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
