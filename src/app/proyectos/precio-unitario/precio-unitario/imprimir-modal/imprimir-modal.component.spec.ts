import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirModalComponent } from './imprimir-modal.component';

describe('ImprimirModalComponent', () => {
  let component: ImprimirModalComponent;
  let fixture: ComponentFixture<ImprimirModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImprimirModalComponent]
    });
    fixture = TestBed.createComponent(ImprimirModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
