import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContratistasComponent } from './table-contratistas.component';

describe('TableContratistasComponent', () => {
  let component: TableContratistasComponent;
  let fixture: ComponentFixture<TableContratistasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableContratistasComponent]
    });
    fixture = TestBed.createComponent(TableContratistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
