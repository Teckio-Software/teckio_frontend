import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFSRComponent } from './dialog-fsr.component';

describe('DialogFSRComponent', () => {
  let component: DialogFSRComponent;
  let fixture: ComponentFixture<DialogFSRComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogFSRComponent]
    });
    fixture = TestBed.createComponent(DialogFSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
