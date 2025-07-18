import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEstimacionesComponent } from './resumen-estimaciones.component';

describe('ResumenEstimacionesComponent', () => {
  let component: ResumenEstimacionesComponent;
  let fixture: ComponentFixture<ResumenEstimacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenEstimacionesComponent]
    });
    fixture = TestBed.createComponent(ResumenEstimacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
