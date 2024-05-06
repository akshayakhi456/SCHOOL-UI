import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReportCardComponent } from './student-report-card.component';

describe('StudentReportCardComponent', () => {
  let component: StudentReportCardComponent;
  let fixture: ComponentFixture<StudentReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentReportCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
