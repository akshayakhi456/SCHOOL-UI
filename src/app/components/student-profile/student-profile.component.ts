import { Component, OnInit, inject } from '@angular/core';
import { StudentService } from '../../shared/services/student/student.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { IStudentGuardianResponse } from '../../shared/models/student.models';
import { HTTP_CODES } from '../../shared/constants/common.constants';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [StudentDetailComponent],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit {
  allStudents = true;
  selectedStudent!: IStudentGuardianResponse;
  studentListData: Array<IStudentGuardianResponse> = [];
  sanitizer = inject(DomSanitizer);

  constructor(private studentService: StudentService,
    private spinnerService: SpinnerService
  ){}

  ngOnInit(): void {
    this.studentList();
  }

  studentList(): void {
    this.spinnerService.show();
    this.studentService.getStudentsByRoles().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.studentListData = res.result!;
        }
      },
      error: () => {this.spinnerService.dispose();}
    })
  }

  stdDetail(item: IStudentGuardianResponse): void {
    if(item) {
      this.allStudents = false;
      this.selectedStudent = item;
    }
  }

  photo(studentPhoto: string | undefined): string {
      if (studentPhoto) {
        const studentBase64Photo = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(studentPhoto) as any).changingThisBreaksApplicationSecurity;
        return studentBase64Photo;
      }
      return '';
  }
}
