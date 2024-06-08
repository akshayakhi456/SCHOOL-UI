import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { IstudentMapSection } from '../../../shared/models/class.models';
import { IExamDetails } from '../../../shared/models/exam.models';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { IExamModel } from '../../../shared/models/setting.models';
import { IAddMarks, ISubjectResponseModel } from '../../../shared/models/subject.models';
import { ExamService } from '../../../shared/services/exam/exam.service';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { GlobalService } from '../../../shared/signal-service/global.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { TeacherService } from '../../../shared/services/teacher/teacher.service';
import { ITeacherDetails } from '../../../shared/models/teacher.models';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-teacher-subject-class',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './teacher-subject-class.component.html',
  styleUrl: './teacher-subject-class.component.scss'
})
export class TeacherSubjectClassComponent {
  className = new FormControl(null, Validators.required);
  acedemicYearId = new FormControl<number | null>(null, Validators.required);
  section = new FormControl(null, Validators.required);
  classList: Array<{label: string; value: string}> = [];
  orgSectionList: Array<{label: string; value: string}> = [];
  sectionList: Array<{label: string; value: string}> = [];
  subjectList: Array<{label: string; value: string}> = [];
  teacherList: Array<ITeacherDetails> = [];
  dataSource = new MatTableDataSource<ISubjectResponseModel>();
  academicList = ACADEMIC_YEAR;
  displayedColumns: string[] = ['Subject', 'Teacher', 'Is Class Teacher'];
  apiColumns: string[] = ['subjectName', 'subjectTeacherId', 'isClassTeacher'] 
  studentList: Array<IstudentMapSection> = [];
  studentMarks: Array<IAddMarks> = [];
  examList: Array<IExamModel> = [];
  savedSubjectTeacher: Array<ISubjectResponseModel> = [];
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
    private globalService: GlobalService,
    private breadcrumb: BreadCrumbService,
    private teacherService: TeacherService,
    private snackbar: SnackbarService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
    globalService.academicYearData.subscribe((res) => {
      this.acedemicYearId.setValue(res);
    })
  }

  ngOnInit(): void {
    this.getClassList();
    this.getSectionList();
    this.getTeacherList();
   
    this.columnsToDisplay = this.displayedColumns.slice();

    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['value'] == res)
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

  getSectionList() {
    this.spinnerService.show();
    this.settingService.getSections().subscribe({next: res => {
      this.spinnerService.dispose();
      this.orgSectionList = res.res.map((x: any) => {
        return {
          label: x.section,
          value: x.id
        }
      })
    },error:() =>{
      this.spinnerService.dispose();
    }})
  }

  getTeacherList(): void {
    this.spinnerService.show();
    this.teacherService.getTeachers()
    .pipe(take(1))
    .subscribe({
      next: (res: IHttpResponse<Array<ITeacherDetails>>) => {
        this.spinnerService.dispose();
        this.teacherList = res.result!;
      },
      error: () =>{
        this.spinnerService.dispose();
      }
    });
  }

  getTeacherSubjects(): void {
    this.spinnerService.show();
    this.subjectService.getSubjectTeacher(this.acedemicYearId.value!, this.className.value!, this.section.value!)
    .pipe(take(1))
    .subscribe({
      next: (res: IHttpResponse<Array<ISubjectResponseModel>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          if (res.result?.length) {
            this.savedSubjectTeacher = res.result!; 
          }
          this.getSubjects();
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
              classId: this.className.value,
              sectionId: this.section.value,
              subjectId: x.id,
              subjectName: x.subject,
              subjectTeacherId: 0,
              isClassTeacher: false,
              academicYearId: this.acedemicYearId.value
            }
          });
          const filteredList = list.filter(x => this.savedSubjectTeacher.findIndex(s => s.subjectId == x.subjectId) == -1);
          this.dataSource.data = [ ...this.savedSubjectTeacher, ...filteredList] as any;
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
    const nonSavedRecord = payload.filter(x => x.id == 0);
    if (isAlreadySavedRecord.length) {
      this.updateSubjectInfo(isAlreadySavedRecord);
    }
    if (nonSavedRecord.length) {
      this.spinnerService.show();
      this.subjectService.saveTeacherSubject(nonSavedRecord).subscribe({
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

  updateSubjectInfo(isAlreadySavedRecord: Array<ISubjectResponseModel>): void {
    this.spinnerService.show();
    this.subjectService.updateTeacherSubject(isAlreadySavedRecord).subscribe({
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
    this.section.reset();
    this.dataSource.data = [];
    this.isShowData = false;
  }
}
