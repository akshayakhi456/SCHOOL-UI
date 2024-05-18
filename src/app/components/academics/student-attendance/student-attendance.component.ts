import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AttendanceRecord, IStudentAttendanceDisplay, IStudentAttendanceMonthYearRequest, IstudentAttendance } from '../../../shared/models/class.models';
import { StudentMapClassService } from '../../../shared/services/student-map-class/student-map-class.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { IStudentGuardianResponse } from '../../../shared/models/student.models';
import { StudentService } from '../../../shared/services/student/student.service';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './student-attendance.component.html',
  styleUrl: './student-attendance.component.scss'
})
export class StudentAttendanceComponent {
  studentList: IStudentAttendanceDisplay = {
    absent: 0,
    total: 0,
    attendanceArray: [],
    halfDay: 0,
    present: 0
  }
  allStudents = true;
  selectedStudent!: IStudentGuardianResponse;
  studentListData: Array<IStudentGuardianResponse> = [];
  sanitizer = inject(DomSanitizer);

  range = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });
  studentAttendanceList: Array<IstudentAttendance> = [];

  constructor(private studentMapClass: StudentMapClassService,
    private studentService: StudentService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.studentListApi();
    this.range.valueChanges.subscribe(() => {
       if(this.range.valid) {
        this.getStudentAttendanceByMonthYear();
       }
    })
  }

  studentListApi(): void {
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

  createAttendanceArrayInRange(studentAttendance: IstudentAttendance[], startDate: Date, endDate: Date) {
    const attendanceArray: AttendanceRecord[] = [];
    let present = 0;
    let absent = 0;
    let halfDay = 0;

    for (const attendance of studentAttendance) {
        const year = parseInt(attendance.year, 10);
        const month = parseInt(attendance.month, 10);

        // Calculate the start and end days of the month
        const startDay = startDate && startDate.getDate() > 1 ? startDate.getDate() : 1;
        const endDay = endDate && endDate.getDate() < 31 ? endDate.getDate() : 31;

        // Loop through days in the month within the specified date range
        for (let i = startDay; i <= endDay; i++) {
            const day = attendance[`d${i}` as keyof IstudentAttendance]; // Access day dynamically

            if (typeof(day) == 'string' && day.trim() !== "") {
                const status: 'P' | 'A' | 'HD' = 
                    day === "P" ? 'P' :
                    day === "A" ? 'A' : 'HD'; // Adjust as needed

                const date = `${year}-${month}-${i}`;

                attendanceArray.push({ date, status });
            }

            // Check if the day is defined and not null or empty
            if (typeof(day) == 'string' && day.trim() !== "") {
              // Get the date corresponding to the current day
              const currentDate = new Date(`${attendance.year}-${attendance.month}-${i}`);
              
              // Check if the day is not Sunday
              if (currentDate.getDay() !== 0) {
                  if (day === "P") {
                      present++;
                  } else if (day == "HD") {
                    halfDay++;
                  } else {
                      absent++;
                  }
              }
          }
        }
    }
    const total = present + absent + halfDay;
    return {attendanceArray, present, absent, halfDay, total};
}

getStudentAttendanceByMonthYear(): void {
  const payload: IStudentAttendanceMonthYearRequest = {
    className: this.selectedStudent.students.className!,
    section: this.selectedStudent.students.section!,
    sId: this.selectedStudent.students.id.toString(),
    startMonth: (new Date(this.range.value.start!).getMonth() + 1),
    startYear: (new Date(this.range.value.start!).getFullYear()).toString(),
    endMonth: (new Date(this.range.value.end!).getMonth() + 1),
    endYear: (new Date(this.range.value.end!).getFullYear()).toString(),
  }
  this.spinnerService.show();
  this.studentMapClass.getStudentAttendanceByMonthYear(payload)
  .subscribe({
    next: (res: IHttpResponse<Array<IstudentAttendance>>) => {
      this.spinnerService.dispose();
      if (res.statusCode === HTTP_CODES.SUCCESS) {
        this.studentAttendanceList = res.result!;
        if(this.studentAttendanceList.length) {
          const data = this.createAttendanceArrayInRange(this.studentAttendanceList, this.range.value.start!, this.range.value.end!);
          this.studentList = data;
          console.log(data);
        }
      }
    },
    error: () => {
      this.spinnerService.dispose();
    }
  })
}

}
