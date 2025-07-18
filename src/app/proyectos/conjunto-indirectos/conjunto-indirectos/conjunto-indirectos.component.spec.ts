import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConjuntoIndirectosComponent } from './conjunto-indirectos.component';

describe('ConjuntoIndirectosComponent', () => {
  let component: ConjuntoIndirectosComponent;
  let fixture: ComponentFixture<ConjuntoIndirectosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConjuntoIndirectosComponent]
    });
    fixture = TestBed.createComponent(ConjuntoIndirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
