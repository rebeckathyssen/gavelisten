import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAdd } from './person-add';

describe('PersonAdd', () => {
  let component: PersonAdd;
  let fixture: ComponentFixture<PersonAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
