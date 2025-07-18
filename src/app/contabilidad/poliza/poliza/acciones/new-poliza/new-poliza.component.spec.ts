import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPolizaComponent } from './new-poliza.component';

describe('NewPolizaComponent', () => {
  let component: NewPolizaComponent;
  let fixture: ComponentFixture<NewPolizaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPolizaComponent]
    });
    fixture = TestBed.createComponent(NewPolizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
