import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaDetailsComponent } from './cuenta-details.component';

describe('CuentaDetailsComponent', () => {
  let component: CuentaDetailsComponent;
  let fixture: ComponentFixture<CuentaDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentaDetailsComponent]
    });
    fixture = TestBed.createComponent(CuentaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
