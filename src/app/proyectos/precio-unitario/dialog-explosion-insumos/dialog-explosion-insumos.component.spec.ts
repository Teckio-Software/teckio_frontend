import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExplosionInsumosComponent } from './dialog-explosion-insumos.component';

describe('DialogExplosionInsumosComponent', () => {
  let component: DialogExplosionInsumosComponent;
  let fixture: ComponentFixture<DialogExplosionInsumosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogExplosionInsumosComponent]
    });
    fixture = TestBed.createComponent(DialogExplosionInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
