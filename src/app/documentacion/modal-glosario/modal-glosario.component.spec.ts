import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGlosarioComponent } from './modal-glosario.component';

describe('ModalGlosarioComponent', () => {
  let component: ModalGlosarioComponent;
  let fixture: ComponentFixture<ModalGlosarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGlosarioComponent]
    });
    fixture = TestBed.createComponent(ModalGlosarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
