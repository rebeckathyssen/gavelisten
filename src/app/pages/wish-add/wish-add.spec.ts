import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishAdd } from './wish-add';

describe('WishAdd', () => {
  let component: WishAdd;
  let fixture: ComponentFixture<WishAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
