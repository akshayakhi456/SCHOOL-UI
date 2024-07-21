import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListCardsComponent } from './student-list-cards.component';

describe('StudentListCardsComponent', () => {
  let component: StudentListCardsComponent;
  let fixture: ComponentFixture<StudentListCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentListCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
