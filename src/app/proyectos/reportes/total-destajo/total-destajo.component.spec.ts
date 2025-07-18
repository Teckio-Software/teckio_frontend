import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDestajoComponent } from './total-destajo.component';

describe('TotalDestajoComponent', () => {
  let component: TotalDestajoComponent;
  let fixture: ComponentFixture<TotalDestajoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalDestajoComponent]
    });
    fixture = TestBed.createComponent(TotalDestajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
