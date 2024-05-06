import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentSubDashboardComponent } from '../student-sub-dashboard/student-sub-dashboard.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss'
})
export class ProgressCardComponent {
  constructor(private dialog: MatDialog) {}
  studentDashboard() {
    this.dialog.open(StudentSubDashboardComponent, {
      width: '80vw',
      height: '100vh',
      position: {
        right: '0'
      }
    });
  }
}
