import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenesEntradasComponent } from './almacenes-entradas.component';

describe('AlmacenesEntradasComponent', () => {
  let component: AlmacenesEntradasComponent;
  let fixture: ComponentFixture<AlmacenesEntradasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmacenesEntradasComponent]
    });
    fixture = TestBed.createComponent(AlmacenesEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
