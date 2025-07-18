import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesBIComponent } from './reportes-bi.component';

describe('ReportesBIComponent', () => {
  let component: ReportesBIComponent;
  let fixture: ComponentFixture<ReportesBIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesBIComponent]
    });
    fixture = TestBed.createComponent(ReportesBIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
