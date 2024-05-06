import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  class = new FormControl('', Validators.required);
  section = new FormControl('', Validators.required);
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['rollNo', 'name'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  daysAsperDates: Array<string> = [];
  attendList = [{
    label: 'Present',
    value: 'P'
  },{
    label: 'Absent',
    value: 'A'
  }]
  day: {[key: number]: string} = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  studentList = [{
    rollNo: 1,
    name: 'A'
  },
  {
    rollNo: 2,
    name: 'B'
  }
]
  studentData: any = []

  ngOnInit(): void {
    for (let student = 0; student < this.studentList.length; student++) {
      let studentObj:any = {};
      for (let date = 1; date <= this.lastDay; date++) {
          if (date === 1) {
              studentObj = { ...this.studentList[student] };
            }
            studentObj[`${date}`] = false;//{ BF: '', AF: '' };
            if (student == 0) {
              this.displayedColumns.push(`${date}`);
            }
          }
      this.studentData[student] = studentObj;
    }
    this.columnsToDisplay = this.displayedColumns.slice()
    this.dataSource.data = this.studentData;
  }

  getWeekOfDay(columnName: string): string{
    if (columnName !== 'rollNo' && columnName !== 'name') {
      const dayOfWeek: number = new Date(this.currentYear, this.currentMonth, Number(columnName)).getDay();
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
}
