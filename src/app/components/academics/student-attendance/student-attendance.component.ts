import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormControl } from '@angular/forms';
import { AttendanceRecord, IstudentAttendance } from '../../../shared/models/class.models';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './student-attendance.component.html',
  styleUrl: './student-attendance.component.scss'
})
export class StudentAttendanceComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  studentAttendance = [
    {
      "id": 1,
      "sId": "2",
      "rollNo": 1,
      "className": "1",
      "section": "A",
      "sName": "Akshay",
      "month": "4",
      "year": "2024",
      "d1": "P",
      "d2": "P",
      "d3": "P",
      "d4": "P",
      "d5": "P",
      "d6": "P",
      "d7": "P",
      "d8": "P",
      "d9": "P",
      "d10": "P",
      "d11": "P",
      "d12": "P",
      "d13": "P",
      "d14": "P",
      "d15": "P",
      "d16": "",
      "d17": "",
      "d18": "",
      "d19": "",
      "d20": "",
      "d21": "",
      "d22": "",
      "d23": "",
      "d24": "",
      "d25": "",
      "d26": "",
      "d27": "",
      "d28": "",
      "d29": "",
      "d30": "",
      "d31": ""
    },
    {
      "id": 3,
      "sId": "2",
      "rollNo": 1,
      "className": "1",
      "section": "A",
      "sName": "AkshayK",
      "month": "5",
      "year": "2024",
      "d1": null,
      "d2": "A",
      "d3": null,
      "d4": null,
      "d5": null,
      "d6": null,
      "d7": "HD",
      "d8": "HD",
      "d9": null,
      "d10": null,
      "d11": null,
      "d12": null,
      "d13": null,
      "d14": null,
      "d15": null,
      "d16": null,
      "d17": null,
      "d18": null,
      "d19": null,
      "d20": null,
      "d21": null,
      "d22": null,
      "d23": null,
      "d24": null,
      "d25": null,
      "d26": null,
      "d27": null,
      "d28": null,
      "d29": null,
      "d30": null,
      "d31": null
    }
  ]

  createAttendanceArrayInRange(studentAttendance: IstudentAttendance[], startDate: Date, endDate: Date) {
    const attendanceArray: AttendanceRecord[] = [];
    let present = 0;
    let absent = 0;
    let halfDay = 0;

    for (const attendance of studentAttendance) {
        const year = parseInt(attendance.Year, 10);
        const month = parseInt(attendance.month, 10);

        // Calculate the start and end days of the month
        const startDay = startDate.getDate() > 1 ? startDate.getDate() : 1;
        const endDay = endDate.getDate() < 31 ? endDate.getDate() : 31;

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
              const currentDate = new Date(`${attendance.Year}-${attendance.month}-${i}`);
              
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

    return {attendanceArray, present, absent, halfDay};
}

}
