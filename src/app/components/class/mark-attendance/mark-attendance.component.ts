import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../../shared/shared.module';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { StudentMapClassService } from '../../../shared/services/student-map-class/student-map-class.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { IStudentAttendanceRequest, IstudentAttendance, IstudentMapSection } from '../../../shared/models/class.models';
import { HTTP_CODES } from '../../../shared/constants/common.constants';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.scss'
})
export class MarkAttendanceComponent {
  className = new FormControl('', Validators.required);
  section = new FormControl('', Validators.required);
  selectedDM = new FormControl(null, [Validators.required]);
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  selectedYear = new Date().getMonth() + 2 <= 5 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  academicYearList = ACADEMIC_YEAR;
  academicYear = new FormControl(this.academicYearList.filter(x => x.year == this.selectedYear)[0].value);
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  daysAsperDates: Array<string> = [];
  classList: Array<{label: string; value: string}> = [];
  orgSectionList: Array<{label: string; value: string}> = [];
  sectionList: Array<{label: string; value: string}> = [];
  studentAttendanceList: Array<IstudentAttendance> = [];
  isShowData = false;
  day: { [key: number]: string } = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  studentList: Array<IstudentMapSection> = [];
  breadcrumbData: IBreadcrumb = {
    title: 'Student Mark Attendance',
    list: [{
      routerLink: '/mark-attendance',
      subTitle: 'Mark-Attendance',
      isRoute: true
  }]
  }
  studentData: any = []

  constructor(private spinnerService: SpinnerService,
    private studentMapClass: StudentMapClassService,
    private settingService: SettingsService,
    private breadcrumb: BreadCrumbService,
    private snackbar: SnackbarService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
  }

  ngOnInit(): void {
    // this.selectedDM.valueChanges.subscribe(() => {
    //   this.selectedDate();
    // })
    this.getClassList();
    this.getSectionList();
   
    this.columnsToDisplay = this.displayedColumns.slice()
    this.dataSource.data = this.studentData;

    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['className'] == res)
    })
  }

  getClassList() {
    this.spinnerService.show();
    this.settingService.getClasses().subscribe(res => {
      this.spinnerService.dispose();
      this.classList = res.map((r: any) => {
        return {
          label: r.className,
          value: r.className
        }
      })
    },()=>{
      this.spinnerService.dispose();
    })
  }

  getSectionList() {
    this.spinnerService.show();
    this.settingService.getSections().subscribe({next: res => {
      this.spinnerService.dispose();
      this.orgSectionList = res.res.map((x: any) => {
        return {
          ...x,
          label: x.section,
          value: x.section
        }
      })
    },error:() =>{
      this.spinnerService.dispose();
    }})
  }

  getWeekOfDay(columnName: string): string {
    if (columnName !== 'rollNo' && columnName !== 'name') {
      const dayOfWeek: number = new Date(this.currentYear, this.currentMonth, Number(columnName.slice(1))).getDay();
      return this.day[dayOfWeek!];
    }
    return '';
  }

  getDaysOfWeekForMonth(year: number, month: number) {
    const daysOfWeek = [];
    // Get the number of days in the given month
    const numDaysInMonth = new Date(year, month, 0).getDate();

    // Loop through each date in the month
    for (let day = 1; day <= numDaysInMonth; day++) {
      // Create a Date object for the current date
      const currentDate = new Date(year, month - 1, day);
      // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
      const dayOfWeek = currentDate.getDay();
      // Add the day of the week to the array
      daysOfWeek.push(dayOfWeek);
    }

    return daysOfWeek;
  }

  selectedDate(): void {
    const date = new Date(this.selectedDM.value!).getDate();
    const month = new Date(this.selectedDM.value!).getMonth() + 1;
    const year = new Date(this.selectedDM.value!).getFullYear();
    this.studentData = [];
    this.displayedColumns = [];
    for (let student = 0; student < this.studentList.length; student++) {
      let studentObj: any = {};
        const attendance = this.studentAttendanceList.find(x => x.sId == this.studentList[student].sId);
        studentObj[`D${date}`] = attendance && (attendance as any)[`d${date}`] ? (attendance as any)[`d${date}`] : 'P';
        studentObj['month'] = month.toString();
        studentObj['Year'] = year.toString();
        if (student == 0) {
          this.displayedColumns = ['rollNo', 'sName'];
          this.displayedColumns.push(`D${date}`);
        }
      studentObj['sName'] = this.studentList[student].firstName +''+ this.studentList[student].lastName;
      studentObj['rollNo'] = this.studentList[student].rollNo;
      studentObj['sId'] = this.studentList[student].sId;
      studentObj['className'] = this.studentList[student].className;
      studentObj['section'] = this.studentList[student].section;
      studentObj['id'] = this.studentAttendanceList.find(x => x.sId == this.studentList[student].sId)?.id || 0;
      this.studentData[student] = studentObj;
    }
    this.columnsToDisplay = this.displayedColumns.slice()
    this.dataSource.data = this.studentData;
  }

  getStudentAssignSectionByYear(): void {
    this.spinnerService.show();
    this.studentMapClass.getStudentAssignSectionYear(this.className.value!, this.section.value!, this.academicYear.value!)
    .subscribe({
      next: (res: IHttpResponse<Array<IstudentMapSection>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          this.studentList = res.result!; 
          this.isShowData = true;
          this.getStudentAttendanceByMonthYear();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  getStudentAttendanceByMonthYear(): void {
    const payload: IstudentAttendance = {
      className: this.className.value!,
      section: this.section.value!,
      month: (new Date(this.selectedDM.value!).getMonth() + 1).toString(),
      Year: (new Date(this.selectedDM.value!).getFullYear()).toString()
    }
    this.spinnerService.show();
    this.studentMapClass.getStudentAttendanceByMonthYear(payload)
    .subscribe({
      next: (res: IHttpResponse<Array<IstudentAttendance>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          this.studentAttendanceList = res.result!;
          this.selectedDate();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  submitAttendance() {
    const payload: Array<IstudentAttendance> = this.dataSource.data as Array<IstudentAttendance>;
    const attendanceExist = payload.filter((x: any) => x?.id > 0);
    const nonExistattendance = payload.filter((x: any) => x.id == 0);

    if(nonExistattendance.length) {
      this.spinnerService.show();
      this.studentMapClass.studentAttendance(nonExistattendance).subscribe({
        next: (res) => {
          this.spinnerService.dispose();
          this.snackbar.openSuccessSnackbar(res.result!);
        },
        error: (err) => {
          this.spinnerService.dispose();
        },
      })
    }

    if(attendanceExist.length) {
      const date = new Date(this.selectedDM.value!).getDate();
      const attendance: Array<IStudentAttendanceRequest> = attendanceExist.map(a => {
        return {
        id: a.id,
        sId: a.sId!,
        className: a.className,
        section: a.section,
        month: a.month,
        year: a.Year,
        date: date,
        attendanceStatus: (a as any)[`D${date}`]
        }
      })
      this.spinnerService.show();
      this.studentMapClass.updateStudentAttendance(attendance).subscribe({
        next: (res) => {
          this.spinnerService.dispose();
          this.snackbar.openSuccessSnackbar(res.result!);
        },
        error: (err) => {
          this.spinnerService.dispose();
        },
      })
    }
  }


}
