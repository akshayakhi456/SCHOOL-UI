import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HTTP_CODES } from '../../../shared/constants/common.constants'; 
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { StudentService } from '../../../shared/services/student/student.service';
import { StudentMapClassService } from '../../../shared/services/student-map-class/student-map-class.service';
import { IStudentAssignSectionRequestModel, IStudentAssignSectionResponseModel, IstudentMapSection } from '../../../shared/models/class.models';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { IStudent } from '../../../shared/models/student.models';

@Component({
  selector: 'app-student-section-assignment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './student-section-assignment.component.html',
  styleUrl: './student-section-assignment.component.scss'
})
export class StudentSectionAssignmentComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  @ViewChild(MatSort) sort!: MatSort;
  sanitizer = inject(DomSanitizer);
  className = new FormControl('', Validators.required)
  studentDataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['photo', 'firstName', 'class', 'gender', 'section'];
  selectedYear = new Date().getMonth() + 2 <= 5 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  academicYearList = ACADEMIC_YEAR;
  academicYear = new FormControl(this.academicYearList.filter(x => x.year == this.selectedYear)[0].value);
  classList: Array<{label: string; value: string}> = [];
  pageSizes = [10,25,50,100];
  orgSectionList = [];
  sectionList: any;
  isChangedData = false;
  studentSection: Array<IStudentAssignSectionResponseModel> = [];
  breadcrumbData: IBreadcrumb = {
    title: 'Student Section Assignment',
    list: [{
      routerLink: '/section-assignment',
      subTitle: 'Section-Assignment',
      isRoute: true
  }]
  }

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private spinnerService: SpinnerService,
    private snackbarService: SnackbarService,
    private studentService: StudentService,
    private settingService: SettingsService,
    private studentMapClass: StudentMapClassService,
    private breadCrumb: BreadCrumbService
  ) { }
  ngOnInit(): void {
    this.breadCrumb.setBreadcrumb(true, this.breadcrumbData)
    this.getClassList();
    this.getSectionList();

    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter(x => x['className'] == res);
      this.isChangedData = false;
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
          value: x.id
        }
      })
    },error:() =>{
      this.spinnerService.dispose();
    }})
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getClassList() {
    this.spinnerService.show();
    this.settingService.getClasses().subscribe({
      next: res => {
      this.spinnerService.dispose();
      this.classList = res.map((r: any) => {
        return {
          label: r.className,
          value: r.className
        }
      })
    },error: ()=>{
      this.spinnerService.dispose();
    }})
  }

  getStudentList() {
    this.spinnerService.show();
    this.studentService.getStudentByClassName(this.className.value!).subscribe({
      next: (res) => {
      this.spinnerService.dispose();
      if(res.statusCode == HTTP_CODES.SUCCESS) {
      this.isChangedData = true;
        let students = res.result.map((std: any)=>{
          const x = std.students;
          return {
            ...x,
            section: this.studentSection?.filter(sec => sec.studentsid == x.id)[0]?.section ?? x.section,
            sectionId: this.studentSection?.filter(sec => sec.studentsid == x.id)[0]?.sectionId ?? 0,
            photoExist : x.photo ? true : false,
            photo: 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(x.photo) as any).changingThisBreaksApplicationSecurity,
            guardian: std.guardians
          }
        });
        students = students.sort((a: IStudent,b: IStudent) => a.section > b.section ? 1 : -1)
        this.studentDataSource.data = students;
        this.studentDataSource.sort = this.sort;
        this.studentDataSource.paginator = this.paginator;
      }
    },error:()=>{
      this.spinnerService.dispose();
    }})

  }

  getStudentSectionByClass() {
    this.spinnerService.show();
    this.studentMapClass.getStudentAssignSection(this.className.value!, 1).subscribe({
      next: (res) => {
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.spinnerService.dispose();
          this.studentSection = res.result!;
          this.getStudentList();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  groupAndAscStudent(): void {
      const isMissingSectionAssign = this.studentDataSource.data.filter((x: any) => x.section == '').length > 0;
      if (isMissingSectionAssign){
        this.snackbarService.openWarningSnackbar("Section Assigning is missing for some students")
        return;
      }

      // Grouping the students by class name
      const groupedStudents = this.studentDataSource.data.reduce((groups, student) => {
        const { section } = student;
        if (!groups[section]) {
            groups[section] = [];
        }
        groups[section].push(student);
        return groups;
      }, {} as { [key: string]: any });

      // Sorting the groups in ascending order
      const sortedGroups = Object.keys(groupedStudents).sort().reduce((sorted, key) => {
        sorted[key] = groupedStudents[key];
        return sorted;
      }, {} as { [key: string]: any });
      
      const studentRanking: Array<IStudentAssignSectionRequestModel> = [];
      Object.keys(sortedGroups).forEach((std: string) => {
        sortedGroups[std].forEach((x: any, i: number) =>{
          studentRanking.push({
            id : x.sectionId,
            studentsid: x.id.toString(),
            rollNo: i + 1,
            classId: x.className,
            sectionId: x.section,
            academicYearId: Number(this.academicYear.value)
          })
        })
      })

      // Output the sorted groups
      this.saveSubject(studentRanking);
  }

  saveSubject(studentRanking: Array<IStudentAssignSectionRequestModel>) {
    this.spinnerService.show();
    this.studentMapClass.studentAssignSection(studentRanking).subscribe({
      next: (res) => {
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.spinnerService.dispose();
          this.snackbarService.openSuccessSnackbar(res.result!);
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  filterChanges(): void{
    if (!this.className.value) {
      this.snackbarService.openWarningSnackbar("Please Select ClassName");
      return
    }
    // this.getStudentList();
    this.getStudentSectionByClass();
  }

  resetForm(): void {
      this.studentDataSource.data = [];
      this.className.reset();
  }

  getCountOfSection(section: string): number {
    return this.studentDataSource.data?.filter((x: any) => x.section == section).length;
  }

  getCountOfNonSection(): number {
    return this.studentDataSource.data?.filter((x: any) => x.section == '').length;
  }
}
