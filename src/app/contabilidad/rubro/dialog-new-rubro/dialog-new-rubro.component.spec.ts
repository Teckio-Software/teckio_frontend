import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewRubroComponent } from './dialog-new-rubro.component';

describe('DialogNewRubroComponent', () => {
  let component: DialogNewRubroComponent;
  let fixture: ComponentFixture<DialogNewRubroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewRubroComponent]
    });
    fixture = TestBed.createComponent(DialogNewRubroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
