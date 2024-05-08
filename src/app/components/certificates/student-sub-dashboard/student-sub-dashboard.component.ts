import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { StudentAttendanceComponent } from '../../academics/student-attendance/student-attendance.component';

@Component({
  selector: 'app-student-sub-dashboard',
  standalone: true,
  imports: [SharedModule, StudentAttendanceComponent],
  templateUrl: './student-sub-dashboard.component.html',
  styleUrl: './student-sub-dashboard.component.scss'
})
export class StudentSubDashboardComponent {

}
