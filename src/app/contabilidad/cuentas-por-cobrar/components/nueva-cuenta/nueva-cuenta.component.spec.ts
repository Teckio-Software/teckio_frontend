import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCuentaComponent } from './nueva-cuenta.component';

describe('NuevaCuentaComponent', () => {
  let component: NuevaCuentaComponent;
  let fixture: ComponentFixture<NuevaCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaCuentaComponent]
    });
    fixture = TestBed.createComponent(NuevaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
