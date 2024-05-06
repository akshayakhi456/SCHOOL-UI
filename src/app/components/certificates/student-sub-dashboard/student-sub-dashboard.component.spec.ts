import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubDashboardComponent } from './student-sub-dashboard.component';

describe('StudentSubDashboardComponent', () => {
  let component: StudentSubDashboardComponent;
  let fixture: ComponentFixture<StudentSubDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSubDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentSubDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
