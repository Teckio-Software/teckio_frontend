import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectosComponent } from './indirectos.component';

describe('IndirectosComponent', () => {
  let component: IndirectosComponent;
  let fixture: ComponentFixture<IndirectosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndirectosComponent]
    });
    fixture = TestBed.createComponent(IndirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
