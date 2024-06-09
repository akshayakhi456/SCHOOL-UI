import { Component } from '@angular/core';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { StudentMapClassService } from '../../../shared/services/student-map-class/student-map-class.service';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { IstudentMapSection } from '../../../shared/models/class.models';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { IAddMarks } from '../../../shared/models/subject.models';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { take } from 'rxjs';
import { IExamModel } from '../../../shared/models/setting.models';
import { GlobalService } from '../../../shared/signal-service/global.service';
import { ExamService } from '../../../shared/services/exam/exam.service';

@Component({
  selector: 'app-add-marks',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-marks.component.html',
  styleUrl: './add-marks.component.scss'
})
export class AddMarksComponent {
  className = new FormControl('', Validators.required);
  section = new FormControl('', Validators.required);
  subject = new FormControl(null, Validators.required);
  acedemicYearId = new FormControl(0, Validators.required);
  exam = new FormControl(null, Validators.required);
  classList: Array<{label: string; value: string}> = [];
  orgSectionList: Array<{label: string; value: string}> = [];
  sectionList: Array<{label: string; value: string}> = [];
  subjectList: Array<{label: string; value: number}> = [];
  dataSource = new MatTableDataSource<IAddMarks>();
  academicList = ACADEMIC_YEAR;
  displayedColumns: string[] = ['rollNo', 'sName', 'marks'];
  studentList: Array<IstudentMapSection> = [];
  studentMarks: Array<IAddMarks> = [];
  examList: Array<IExamModel> = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  isShowData = false;
  breadcrumbData: IBreadcrumb = {
    title: 'Student Subject Mark',
    list: [{
      routerLink: '/subject-marks',
      subTitle: 'subject-marks',
      isRoute: true
  }]
  }
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private examService: ExamService,
    private studentMapClass: StudentMapClassService,
    private subjectService: SubjectService,
    private breadcrumb: BreadCrumbService,
    private globalService: GlobalService,
    private snackbar: SnackbarService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
    globalService.academicYearData.subscribe((res: number) =>{
      this.acedemicYearId.setValue(res!);
    })
  }

  ngOnInit(): void {
    this.getClassList();
    this.getSectionList();
    this.getExam();
   
    this.columnsToDisplay = this.displayedColumns.slice();

    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['className'] == res);
      if (res && this.exam.value) {
        this.getSubjects();
      }
    })

    this.exam.valueChanges.subscribe(res => {
      if (res && this.className.value) {
        this.getSubjects();
      }
    })
  }

  getClassList() {
    this.spinnerService.show();
    this.settingService.getClasses().subscribe(res => {
      this.spinnerService.dispose();
      this.classList = res.map((r: any) => {
        return {
          label: r.className,
          value: r.id
        }
      })
    },()=>{
      this.spinnerService.dispose();
    })
  }

  getExam(): void {
    this.spinnerService.show();
    this.settingService.getExam().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.examList = res.result!;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
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

  getStudentAssignSectionByYear(): void {
    this.spinnerService.show();
    this.studentMapClass.getStudentAssignSectionYear(this.className.value!, this.section.value!, this.acedemicYearId.value!)
    .pipe(take(1))
    .subscribe({
      next: (res: IHttpResponse<Array<IstudentMapSection>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          this.studentList = res.result!; 
          this.isShowData = true;
          this.getStudentAssignedMarks();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  getStudentAssignedMarks(): void {
    this.spinnerService.show();
    this.subjectService.getMarksByClass(this.className.value!,
       this.section.value!,
       this.acedemicYearId.value!,
       this.subject.value!,
       this.exam.value!
      )
    .subscribe({
      next: (res: IHttpResponse<Array<IAddMarks>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          this.studentMarks = res.result!;
          const studentMarks = this.studentList.map((std) => {
            const student = this.studentMarks.find(x=>x.sid === Number(std.sId));
            if (student) {
              return {
                id: student.id,
                sid: student.sid,
                rollNo: student.rollNo,
                sName: student.sName,
                acedamicYearId: student.acedamicYearId,
                subjectId: student.subjectId,
                examId: student.examId,
                marks: student.marks
              }
            }
            else {
              return {
                id: 0,
                sid: Number(std.sId),
                rollNo: std.rollNo,
                sName: std.firstName+' '+std.lastName,
                acedamicYearId: std.academicYear,
                subjectId: Number(this.subject.value),
                examId: Number(this.exam.value),
                marks: ''
              }
            }
          }) 
          this.isShowData = true;
          this.studentMarks = studentMarks.sort((a,b) => a.rollNo > b.rollNo ? 1 : -1);
          this.dataSource.data = this.studentMarks;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  getSubjects(): void {
    this.spinnerService.show();
    this.examService.getExamsDetails(this.acedemicYearId.value!, Number(this.className.value!), this.exam.value!).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.subjectList = res.result!.filter(x => x.willExamConduct).map((res) => {
            return {
              label: res.subjectName,
              value: res.subjectId
            }
          });
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  submitMarks(): void {
    const payload = this.dataSource.data;
    this.spinnerService.show();
    this.subjectService.addMarks(payload).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.snackbar.openSuccessSnackbar(res.result!);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    });
  }

  resetFilter(): void {
    this.className.reset();
    this.section.reset();
    this.subject.reset();
    this.dataSource.data = [];
    this.isShowData = false;
  }
}
