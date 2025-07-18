import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladoComponent } from './acumulado.component';

describe('AcumuladoComponent', () => {
  let component: AcumuladoComponent;
  let fixture: ComponentFixture<AcumuladoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcumuladoComponent]
    });
    fixture = TestBed.createComponent(AcumuladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
