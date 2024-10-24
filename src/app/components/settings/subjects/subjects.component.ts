import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { ISubjectModel } from '../../../shared/models/setting.models';
import { HTTP_CODES } from '../../../shared/constants/common.constants';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent {
  @ViewChild('openSubjectPopup') openSubjectPopup!: TemplateRef<any>;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  subjectName = new FormControl('', [Validators.required, Validators.maxLength(50)])
  subjectDataSource = new MatTableDataSource<ISubjectModel>([]);
  displayedSubjectColumns: string[] = ['subjectName', 'action'];
  originalSubjectName: string = '';
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private spinnerService: SpinnerService,
    private snackbarService: SnackbarService,
    private settingService: SettingsService,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.getSubjects();
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

  getSubjects(): void {
    this.spinnerService.show();
    this.settingService.subjectList().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.subjectDataSource.data = res.result!;
          this.subjectDataSource.sort = this.sort;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  saveSubject() {
    if (!this.subjectName.value) {
      this.snackbarService.openWarningSnackbar("SubjectName is required");
      return
    }
    this.spinnerService.show();
    this.settingService.createSubject({ id: 0, subjectName: this.subjectName.value! }).subscribe({
      next: (res) => {
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.spinnerService.dispose();
          this.snackbarService.openSuccessSnackbar(res.result!);
          this.getSubjects();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  updateSubject(element: ISubjectModel) {
    if (!element.subjectName) {
      this.snackbarService.openWarningSnackbar("SubjectName is required");
      return
    }
    this.spinnerService.show();
    this.settingService.subjectUpdate(element).subscribe({
      next: (res) => {
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.spinnerService.dispose();
          this.snackbarService.openSuccessSnackbar(res.result!);
          this.getSubjects();
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  changeSubjectName(element: ISubjectModel & {isEditSubjectMode: boolean}) {
    element.isEditSubjectMode = !element.isEditSubjectMode;
    this.originalSubjectName = element.subjectName;
  }

  cancelChangingSubjectName(element: ISubjectModel & {isEditSubjectMode: boolean}) {
    element.isEditSubjectMode = !element.isEditSubjectMode;
    element.subjectName = this.originalSubjectName;
  }

  addSubject() {
    this.subjectName.reset();
    this.dialog.open(this.openSubjectPopup)
  }
}
