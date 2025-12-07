import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ideaslist } from './ideaslist';

describe('Ideaslist', () => {
  let component: Ideaslist;
  let fixture: ComponentFixture<Ideaslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ideaslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ideaslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
