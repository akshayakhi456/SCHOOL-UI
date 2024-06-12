import { Component } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IExamModel } from '../../../shared/models/setting.models';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { GlobalService } from '../../../shared/signal-service/global.service';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { IProgressCardResponseModel } from '../../../shared/models/subject.models';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss'
})
export class ProgressCardComponent {
  className = new FormControl(0, Validators.required);
  section = new FormControl(0, Validators.required);
  acedemicYearId = new FormControl(0, Validators.required);
  exam = new FormControl(0, Validators.required);
  classList: Array<{label: string; value: number}> = [];
  orgSectionList: Array<{label: string; value: number}> = [];
  sectionList: Array<{label: string; value: number}> = [];
  examList: Array<IExamModel> = [];
  studentMarks: Array<IProgressCardResponseModel> = [];
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private subjectService: SubjectService,
    private globalService: GlobalService
  ) {
    globalService.academicYearData.subscribe((res) => {
      this.acedemicYearId.setValue(res);
    })
  }

  ngOnInit(): void {
    this.getClassList();
    this.getSectionList();
    this.getExam();
    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['classesId'] == res);
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
          ...x,
          label: x.section,
          value: x.id
        }
      })
    },error:() =>{
      this.spinnerService.dispose();
    }})
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

  getStudentMarks(): void {
    this.spinnerService.show();
    this.subjectService.getMarksOfStudents(
       this.acedemicYearId.value!,
       this.className.value!,
       this.section.value!,
       this.exam.value!
      )
    .subscribe({
      next: (res: IHttpResponse<Array<IProgressCardResponseModel>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          this.studentMarks = res.result!;
          console.log(res.result);
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  resetFilter(): void{

  }
}
