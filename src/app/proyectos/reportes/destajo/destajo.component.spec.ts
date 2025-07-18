  import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestajoComponent } from './destajo.component';

describe('DestajoComponent', () => {
  let component: DestajoComponent;
  let fixture: ComponentFixture<DestajoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestajoComponent]
    });
    fixture = TestBed.createComponent(DestajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
