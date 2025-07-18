import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCuentasBancariasComponent } from './table-cuentas-bancarias.component';

describe('TableCuentasBancariasComponent', () => {
  let component: TableCuentasBancariasComponent;
  let fixture: ComponentFixture<TableCuentasBancariasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableCuentasBancariasComponent]
    });
    fixture = TestBed.createComponent(TableCuentasBancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
