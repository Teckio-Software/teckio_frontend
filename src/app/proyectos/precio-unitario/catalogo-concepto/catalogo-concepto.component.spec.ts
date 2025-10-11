import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoConceptoComponent } from './catalogo-concepto.component';

describe('CatalogoConceptoComponent', () => {
  let component: CatalogoConceptoComponent;
  let fixture: ComponentFixture<CatalogoConceptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoConceptoComponent]
    });
    fixture = TestBed.createComponent(CatalogoConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
