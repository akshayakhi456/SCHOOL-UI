import { Component } from '@angular/core';
import { StudentListCardsComponent } from '../student-list-cards/student-list-cards.component';
import { ProgressCardComponent as OrgProgressCardComponent } from '../../class/progress-card/progress-card.component';
import { IStudentGuardianResponse } from '../../../shared/models/student.models';

@Component({
  selector: 'app-std-progress-card',
  standalone: true,
  imports: [StudentListCardsComponent, OrgProgressCardComponent],
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss'
})
export class ProgressCardComponent {
  allStudents = true;
  selectedStudent!: IStudentGuardianResponse;
  studentId: number | null = null;
  stdDetail(item: IStudentGuardianResponse): void {
    if(item) {
      this.allStudents = false;
      this.selectedStudent = item;
      this.studentId = item.students.id;
    }
  }
}
