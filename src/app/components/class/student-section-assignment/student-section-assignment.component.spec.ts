import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSectionAssignmentComponent } from './student-section-assignment.component';

describe('StudentSectionAssignmentComponent', () => {
  let component: StudentSectionAssignmentComponent;
  let fixture: ComponentFixture<StudentSectionAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSectionAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentSectionAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
