import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IStudentGuardianResponse } from '../../../shared/models/student.models';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { StudentService } from '../../../shared/services/student/student.service';

@Component({
  selector: 'app-student-list-cards',
  standalone: true,
  imports: [],
  templateUrl: './student-list-cards.component.html',
  styleUrl: './student-list-cards.component.scss'
})
export class StudentListCardsComponent {
  sanitizer = inject(DomSanitizer);
  spinnerService = inject(SpinnerService);
  studentService = inject(StudentService);
  @Output() buttonClick = new EventEmitter();
  studentListData: Array<IStudentGuardianResponse> = [];

  ngOnInit(): void {
    this.studentListApi();
  }

  studentListApi(): void {
    this.spinnerService.show();
    this.studentService.getStudentsByRoles().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.studentListData = res.result!;
          this.studentListData.forEach(g => {
            g.students.className = g.students.classes?.className!;
          })
        }
      },
      error: () => {this.spinnerService.dispose();}
    })
  }

  photo(studentPhoto: string | undefined): string {
    if (studentPhoto) {
      const studentBase64Photo = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(studentPhoto) as any).changingThisBreaksApplicationSecurity;
      return studentBase64Photo;
    }
    return '';
  }

  stdDetail(item: IStudentGuardianResponse): void {
    if(item) {
      this.buttonClick.emit(item);
    }
  }
}

