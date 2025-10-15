import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizPrecioUnitarioComponent } from './matriz-precio-unitario.component';

describe('MatrizPrecioUnitarioComponent', () => {
  let component: MatrizPrecioUnitarioComponent;
  let fixture: ComponentFixture<MatrizPrecioUnitarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatrizPrecioUnitarioComponent]
    });
    fixture = TestBed.createComponent(MatrizPrecioUnitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
