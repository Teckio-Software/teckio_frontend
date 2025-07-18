import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEmpleadoPrecioUnitarioComponent } from './tabla-empleado-precio-unitario.component';

describe('TablaEmpleadoPrecioUnitarioComponent', () => {
  let component: TablaEmpleadoPrecioUnitarioComponent;
  let fixture: ComponentFixture<TablaEmpleadoPrecioUnitarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaEmpleadoPrecioUnitarioComponent]
    });
    fixture = TestBed.createComponent(TablaEmpleadoPrecioUnitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
