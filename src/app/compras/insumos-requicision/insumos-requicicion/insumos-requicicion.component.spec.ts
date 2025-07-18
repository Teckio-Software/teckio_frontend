import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosRequicicionComponent } from './insumos-requicicion.component';

describe('InsumosRequicicionComponent', () => {
  let component: InsumosRequicicionComponent;
  let fixture: ComponentFixture<InsumosRequicicionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsumosRequicicionComponent]
    });
    fixture = TestBed.createComponent(InsumosRequicicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
