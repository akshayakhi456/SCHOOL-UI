import { Component, TemplateRef, inject, ViewChild, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IStudentGuardianResponse } from '../../../shared/models/student.models';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { StudentListCardsComponent } from '../student-list-cards/student-list-cards.component';
import { GlobalService } from '../../../shared/signal-service/global.service';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [SharedModule, StudentListCardsComponent, CommonModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.scss'
})
export class ApplyLeaveComponent implements OnInit {
  @ViewChild('openApplyLeave') openApplyLeave! : TemplateRef<any>;
  dialog = inject(MatDialog);
  sanitizer = inject(DomSanitizer);
  spinnerService = inject(SpinnerService);
  snackbarService = inject(SnackbarService);
  studentService = inject(StudentService);
  globalService = inject(GlobalService);
  leaveApplyForm = new FormGroup({
    purposeOfLeave: new FormControl<string | null>(null, Validators.required),
    noOfDays: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    remarks: new FormControl<string | null>(null, Validators.required)
  })

  displayedColumns = ['purposeOfLeave', 'dateRangeOfLeave', 'approval', 'remarks'];
  allStudents = true;
  academicYearId: number = 0;
  selectedStudent!: IStudentGuardianResponse;
  dataSource = new MatTableDataSource();
  studentListData: Array<IStudentGuardianResponse> = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.globalService.academicYearData.subscribe((res) =>{
      this.academicYearId = Number(res);
    })
  }

  getStudentLeave(): void {
    this.spinnerService.show();
    this.studentService.getStudentLeave(this.academicYearId, this.selectedStudent.students.id).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.dataSource.data = res.result!;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

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
      this.getStudentLeave();
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
    this.spinnerService.show();
    this.studentService.leaveApply(payload).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.snackbarService.openSuccessSnackbar(res.result!);
          this.getStudentLeave();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
}
