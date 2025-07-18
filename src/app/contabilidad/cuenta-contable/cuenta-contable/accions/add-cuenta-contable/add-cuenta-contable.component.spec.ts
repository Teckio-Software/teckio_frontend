import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuentaContableComponent } from './add-cuenta-contable.component';

describe('AddCuentaContableComponent', () => {
  let component: AddCuentaContableComponent;
  let fixture: ComponentFixture<AddCuentaContableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCuentaContableComponent]
    });
    fixture = TestBed.createComponent(AddCuentaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
