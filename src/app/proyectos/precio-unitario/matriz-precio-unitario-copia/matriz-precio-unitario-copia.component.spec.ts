import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizPrecioUnitarioCopiaComponent } from './matriz-precio-unitario-copia.component';

describe('MatrizPrecioUnitarioComponent', () => {
  let component: MatrizPrecioUnitarioCopiaComponent;
  let fixture: ComponentFixture<MatrizPrecioUnitarioCopiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatrizPrecioUnitarioCopiaComponent]
    });
    fixture = TestBed.createComponent(MatrizPrecioUnitarioCopiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
