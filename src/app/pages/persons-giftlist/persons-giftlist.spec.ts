import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsGiftlist } from './persons-giftlist';

describe('PersonsGiftlist', () => {
  let component: PersonsGiftlist;
  let fixture: ComponentFixture<PersonsGiftlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonsGiftlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonsGiftlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
