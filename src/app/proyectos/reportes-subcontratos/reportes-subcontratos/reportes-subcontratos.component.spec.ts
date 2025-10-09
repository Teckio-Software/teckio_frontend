import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesSubcontratosComponent } from './reportes-subcontratos.component';

describe('ReportesSubcontratosComponent', () => {
  let component: ReportesSubcontratosComponent;
  let fixture: ComponentFixture<ReportesSubcontratosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesSubcontratosComponent]
    });
    fixture = TestBed.createComponent(ReportesSubcontratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
