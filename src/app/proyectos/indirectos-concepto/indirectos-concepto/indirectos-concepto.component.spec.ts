import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectosConceptoComponent } from './indirectos-concepto.component';

describe('IndirectosConceptoComponent', () => {
  let component: IndirectosConceptoComponent;
  let fixture: ComponentFixture<IndirectosConceptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndirectosConceptoComponent]
    });
    fixture = TestBed.createComponent(IndirectosConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
