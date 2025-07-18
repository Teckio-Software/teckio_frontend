import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEstimacionesComponent } from './table-estimaciones.component';

describe('TableEstimacionesComponent', () => {
  let component: TableEstimacionesComponent;
  let fixture: ComponentFixture<TableEstimacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableEstimacionesComponent]
    });
    fixture = TestBed.createComponent(TableEstimacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
