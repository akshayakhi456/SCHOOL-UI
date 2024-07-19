import { Component, TemplateRef, inject, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IStudentGuardianResponse } from '../../../shared/models/student.models';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { StudentListCardsComponent } from '../student-list-cards/student-list-cards.component';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [SharedModule, StudentListCardsComponent],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.scss'
})
export class ApplyLeaveComponent {
  @ViewChild('openApplyLeave') openApplyLeave! : TemplateRef<any>;
  dialog = inject(MatDialog);
  sanitizer = inject(DomSanitizer);
  spinnerService = inject(SpinnerService);
  studentService = inject(StudentService);
  leaveApplyForm = new FormGroup({
    purposeOfLeave: new FormControl<string | null>(null, Validators.required),
    noOfDays: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    remarks: new FormControl<string | null>(null, Validators.required)
  })

  displayedColumns = ['rollNo', 'purposeOfLeave', 'dateRangeOfLeave', 'status', 'remarks'];
  allStudents = true;
  academicYearId: number = 0;
  selectedStudent!: IStudentGuardianResponse;
  dataSource = new MatTableDataSource();
  studentListData: Array<IStudentGuardianResponse> = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  openAppplyLeave() {
    const dialog = this.dialog.open(this.openApplyLeave, {
      width: '40vw',
      height: '100vh',
      position: {
        right: '0'
      }
    })
  }

  stdDetail(item: IStudentGuardianResponse): void {
    if(item) {
      this.allStudents = false;
      this.selectedStudent = item;
    }
  }

  saveLeave(): void {
    const form = this.leaveApplyForm.value;
    let payload = {
      id: 0,
      purposeOfLeave: form.purposeOfLeave!,
      noOfDays: form.noOfDays!,
      startDate: form.startDate!,
      endDate: form.endDate!,
      remarks: form.remarks!,
      approval: false,
      studentId: this.selectedStudent.students.id,
      academicYearId: this.academicYearId,
      classId: this.selectedStudent.students.currentClassName!,
      sectionId: Number(this.selectedStudent.students.section!)
    }

    this.studentService.leaveApply(payload).subscribe({
      next: () => {
        
      }
    })
  }
}
