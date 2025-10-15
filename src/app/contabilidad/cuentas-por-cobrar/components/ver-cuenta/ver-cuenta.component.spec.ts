import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCuentaComponent } from './ver-cuenta.component';

describe('VerCuentaComponent', () => {
  let component: VerCuentaComponent;
  let fixture: ComponentFixture<VerCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerCuentaComponent],
    });
    fixture = TestBed.createComponent(VerCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
