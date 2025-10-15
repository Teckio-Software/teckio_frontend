import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstimacionesComponent } from './estimaciones.component';
import { calcularAnticipo } from './estimaciones.component';

describe('IndirectosComponent', () => {
  let component: EstimacionesComponent;
  let fixture: ComponentFixture<EstimacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimacionesComponent]
    });
    fixture = TestBed.createComponent(EstimacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('calcularAnticipo', () => {    
  it('devuelve 200,000 con 1,000,000 y 20', ()=>{
    const anticipo = calcularAnticipo(1000000, 16);
    expect(anticipo).toBe(200000);
  });
  
});
