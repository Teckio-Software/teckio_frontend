import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoNewConceptoComponent } from './dialo-new-concepto.component';

describe('DialoNewConceptoComponent', () => {
  let component: DialoNewConceptoComponent;
  let fixture: ComponentFixture<DialoNewConceptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialoNewConceptoComponent]
    });
    fixture = TestBed.createComponent(DialoNewConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
