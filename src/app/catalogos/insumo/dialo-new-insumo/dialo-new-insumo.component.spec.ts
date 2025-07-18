import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoNewInsumoComponent } from './dialo-new-insumo.component';

describe('DialoNewInsumoComponent', () => {
  let component: DialoNewInsumoComponent;
  let fixture: ComponentFixture<DialoNewInsumoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialoNewInsumoComponent]
    });
    fixture = TestBed.createComponent(DialoNewInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
