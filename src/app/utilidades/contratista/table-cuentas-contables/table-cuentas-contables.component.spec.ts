import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCuentasContablesComponent } from './table-cuentas-contables.component';

describe('TableCuentasContablesComponent', () => {
  let component: TableCuentasContablesComponent;
  let fixture: ComponentFixture<TableCuentasContablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableCuentasContablesComponent]
    });
    fixture = TestBed.createComponent(TableCuentasContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
