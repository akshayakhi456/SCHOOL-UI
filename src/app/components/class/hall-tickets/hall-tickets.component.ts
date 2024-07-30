import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IHttpResponse } from '../../../shared/models/auth.models';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { IExamModel } from '../../../shared/models/setting.models';
import { IStudentHallTicket } from '../../../shared/models/subject.models';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { GlobalService } from '../../../shared/signal-service/global.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TitleHeadingService } from '../../../shared/services/title-heading/title-heading.service';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-hall-tickets',
  standalone: true,
  imports: [SharedModule, CommonModule, NgxPrintModule],
  templateUrl: './hall-tickets.component.html',
  styleUrl: './hall-tickets.component.scss'
})
export class HallTicketsComponent {
  @ViewChild('printHallTicket') printHallTicket!: ElementRef;
  @Input()  studentLogin: boolean = false;
  @Input() studentId: number | null = null;
  @Input() classId: number | null = null;
  academicYear = '';
  className = new FormControl(0, Validators.required);
  section = new FormControl(0, Validators.required);
  acedemicYearId = new FormControl(0, Validators.required);
  exam = new FormControl(0, Validators.required);
  classList: Array<{label: string; value: number}> = [];
  orgSectionList: Array<{label: string; value: number}> = [];
  sectionList: Array<{label: string; value: number}> = [];
  examList: Array<IExamModel> = [];
  studentHallTicket: Array<IStudentHallTicket> = [];
  htmlContent!: SafeHtml;
  img!: string;
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private subjectService: SubjectService,
    private globalService: GlobalService,
    private titleHeadingService: TitleHeadingService,
    private sanitizer: DomSanitizer,
  ) {
    globalService.academicYearData.subscribe((res) => {
      this.acedemicYearId.setValue(res);
      this.academicYear = ACADEMIC_YEAR.filter(a =>a.value == res)[0].label;
    })
  }

  ngOnInit(): void {
    this.className.setValue(this.classId);
    this.getTitle();
    this.getClassList();
    this.getSectionList();
    this.getExam();
    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['classesId'] == res);
    })
  }

  getTitle(): void {
    this.spinnerService.show();
    this.titleHeadingService.getByQueryTitleHeader('receipt').subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.img = this.returnBase64(res.result?.photo!);
        this.htmlContent = this.returnHTML(res.result?.description!);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
  returnBase64(photo: string): string{
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(photo) as any).changingThisBreaksApplicationSecurity
  }
  returnHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
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

  getstudentHallTicket(): void {
    this.spinnerService.show();
    this.subjectService.getStudentHallTicket(
       this.acedemicYearId.value!,
       this.className.value!,
       this.section.value!,
       this.exam.value!,
       this.studentId!
      )
    .subscribe({
      next: (res: IHttpResponse<Array<IStudentHallTicket>>) => {
        this.spinnerService.dispose();
        if (res.statusCode === HTTP_CODES.SUCCESS) {
          this.studentHallTicket = res.result!;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  resetFilter(): void{
    this.className.reset();
    this.section.reset();
    this.exam.reset();
    this.studentHallTicket = [];
  }

  parseDate(date: string) {
    const parseDate = date.split('-');
    const parseTime = parseDate[2].split(' ');
    const parsedDate = `${parseTime[0]}/${parseDate[1]}/${parseDate[0]} ${parseTime[1]}`
 
    return parsedDate
  }

}
