import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishAdderLogic } from './wish-adder-logic';

describe('WishAdderLogic', () => {
  let component: WishAdderLogic;
  let fixture: ComponentFixture<WishAdderLogic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishAdderLogic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishAdderLogic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
