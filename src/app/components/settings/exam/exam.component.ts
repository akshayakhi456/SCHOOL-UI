import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { IClasses, IExamModel, ISubjectModel } from '../../../shared/models/setting.models';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent {
  @ViewChild('openSubjectPopup') openSubjectPopup!: TemplateRef<any>;
  examName = new FormControl('', Validators.required);
  examDataSource = new MatTableDataSource<IExamModel>([]);
  subject = new FormControl('', Validators.required);
  class = new FormControl('', Validators.required);
  subjectDataSource = new MatTableDataSource<any>();
  displayedExamColumns: string[] = ['examName', 'action'];
  displayedSubjectColumns: string[] = ['className','subjectName', 'action'];
  subjectList: Array<ISubjectModel> = [];
  classList: Array<IClasses> = [];
  openExam = {examName: '', id: 0};
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private spinnerService: SpinnerService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private settingService: SettingsService
  ) { }
  ngOnInit(): void {
    this.getExam();
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

  getExam(): void {
    this.spinnerService.show();
    this.settingService.getExam().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.examDataSource.data = res.result!;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  saveExam() {
    if (!this.examName.value) {
      this.snackbarService.openWarningSnackbar("examName is required");
      return
    }
    this.spinnerService.show();
    this.settingService.postExam({ id: 0, examName: this.examName.value! }).subscribe({
      next: (res) => {
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.spinnerService.dispose();
          this.snackbarService.openSuccessSnackbar(res.result!);
          this.getExam();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  updateExam(element: IExamModel) {
    if (!element.examName) {
      this.snackbarService.openWarningSnackbar("examName is required");
      return
    }
    this.spinnerService.show();
    this.settingService.putExam(element).subscribe({
      next: (res) => {
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.spinnerService.dispose();
          this.snackbarService.openSuccessSnackbar(res.result!);
          this.getExam();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

}
