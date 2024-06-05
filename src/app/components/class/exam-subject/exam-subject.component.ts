import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { IstudentMapSection } from '../../../shared/models/class.models';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { IExamModel } from '../../../shared/models/setting.models';
import { IAddMarks } from '../../../shared/models/subject.models';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { StudentMapClassService } from '../../../shared/services/student-map-class/student-map-class.service';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { ExamService } from '../../../shared/services/exam/exam.service';
import { IExamDetails } from '../../../shared/models/exam.models';

@Component({
  selector: 'app-exam-subject',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './exam-subject.component.html',
  styleUrl: './exam-subject.component.scss'
})
export class ExamSubjectComponent {
  className = new FormControl(null, Validators.required);
  acedemicYearId = new FormControl(null, Validators.required);
  exam = new FormControl(null, Validators.required);
  classList: Array<{label: string; value: string}> = [];
  orgSectionList: Array<{label: string; value: string}> = [];
  sectionList: Array<{label: string; value: string}> = [];
  subjectList: Array<{label: string; value: string}> = [];
  dataSource = new MatTableDataSource<IExamDetails>();
  academicList = ACADEMIC_YEAR;
  displayedColumns: string[] = ['Subject', 'Min Marks', 'Max Marks', 'Is Consider In Total Marks', 'Exam Conducting', 'Exam Date'];
  apiColumns: string[] = ['subject', 'minMarks', 'maxMarks', 'isAddInTotal', 'willExamConduct', 'examDate'] 
  studentList: Array<IstudentMapSection> = [];
  studentMarks: Array<IAddMarks> = [];
  examList: Array<IExamModel> = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  isShowData = false;
  breadcrumbData: IBreadcrumb = {
    title: 'Student Exam Subject',
    list: [{
      routerLink: '/exam-subject',
      subTitle: 'exam-subject',
      isRoute: true
  }]
  }
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private subjectService: SubjectService,
    private examService: ExamService,
    private breadcrumb: BreadCrumbService,
    private snackbar: SnackbarService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
  }

  ngOnInit(): void {
    this.getClassList();
    this.getExam();
   
    this.columnsToDisplay = this.displayedColumns.slice();

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

  getExamsDetails(): void {
    this.spinnerService.show();
    this.examService.getExamsDetails(this.acedemicYearId.value!, this.className.value!, this.exam.value!)
    .pipe(take(1))
    .subscribe({
      next: (res: IHttpResponse<Array<IExamDetails>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          if (res.result?.length) {
            this.dataSource.data = res.result!; 
          }
          else {
            this.getSubjects();

          }
          this.isShowData = true;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  getSubjects(): void {
    this.spinnerService.show();
    this.subjectService.getClassWiseSubjects(this.className.value!, this.acedemicYearId.value!).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS && res.result) {
          const list = res.result.map( x=> {
            return {
              id: 0,
              subject: x.subject,
              classId: this.className.value,
              examId: this.exam.value,
              minMarks: null,
              maxMarks: null,
              isAddInTotal: false,
              willExamConduct: false,
              ExamDate: null,
              academicYearId: this.acedemicYearId.value
            }
          });
          this.dataSource.data = list as any;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  saveExamDetails(): void {
    const payload = this.dataSource.data;
    const isAlreadySavedRecord = payload.filter(x => x.id > 0);
    if (isAlreadySavedRecord.length) {
      this.updateSubjectInfo(isAlreadySavedRecord);
    }
    if (isAlreadySavedRecord.length !== payload.length) {
      this.spinnerService.show();
      this.examService.addExamsDetails(payload).subscribe({
        next: (res) => {
          this.spinnerService.dispose();
          this.snackbar.openSuccessSnackbar(res.result!);
        },
        error: () => {
          this.spinnerService.dispose();
        }
      });
    }
  }

  updateSubjectInfo(isAlreadySavedRecord: Array<IExamDetails>): void {
    this.spinnerService.show();
    this.examService.updateExamsDetails(isAlreadySavedRecord).subscribe({
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
    this.acedemicYearId.reset();
    this.exam.reset();
    this.dataSource.data = [];
    this.isShowData = false;
  }
}
