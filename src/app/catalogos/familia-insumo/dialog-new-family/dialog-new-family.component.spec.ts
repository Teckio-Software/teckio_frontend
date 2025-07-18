import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewFamilyComponent } from './dialog-new-family.component';

describe('DialogNewFamilyComponent', () => {
  let component: DialogNewFamilyComponent;
  let fixture: ComponentFixture<DialogNewFamilyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNewFamilyComponent]
    });
    fixture = TestBed.createComponent(DialogNewFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
