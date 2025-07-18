import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoMovimientoBancarioComponent } from './nuevo-movimiento-bancario.component';

describe('NuevoMovimientoBancarioComponent', () => {
  let component: NuevoMovimientoBancarioComponent;
  let fixture: ComponentFixture<NuevoMovimientoBancarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoMovimientoBancarioComponent]
    });
    fixture = TestBed.createComponent(NuevoMovimientoBancarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
