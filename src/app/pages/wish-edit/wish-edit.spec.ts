import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishEdit } from './wish-edit';

describe('WishEdit', () => {
  let component: WishEdit;
  let fixture: ComponentFixture<WishEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
