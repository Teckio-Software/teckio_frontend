import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewInsumoComponent } from './dialog-new-insumo.component';

describe('DialogNewInsumoComponent', () => {
  let component: DialogNewInsumoComponent;
  let fixture: ComponentFixture<DialogNewInsumoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewInsumoComponent]
    });
    fixture = TestBed.createComponent(DialogNewInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
