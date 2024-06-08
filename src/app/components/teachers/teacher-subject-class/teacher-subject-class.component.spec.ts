import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubjectClassComponent } from './teacher-subject-class.component';

describe('TeacherSubjectClassComponent', () => {
  let component: TeacherSubjectClassComponent;
  let fixture: ComponentFixture<TeacherSubjectClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSubjectClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherSubjectClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
