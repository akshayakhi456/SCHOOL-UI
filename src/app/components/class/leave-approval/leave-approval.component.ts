import { Component } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { GlobalService } from '../../../shared/signal-service/global.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ITeacherLeaveApprove } from '../../../shared/models/student.models';
import { StudentService } from '../../../shared/services/student/student.service';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [SharedModule, CommonModule, ConfirmationModalComponent],
  templateUrl: './leave-approval.component.html',
  styleUrl: './leave-approval.component.scss'
})
export class LeaveApprovalComponent {
  className = new FormControl(null, Validators.required);
  section = new FormControl(null, Validators.required);
  acedemicYearId = new FormControl(0, Validators.required);
  classList: Array<{label: string; value: string}> = [];
  orgSectionList: Array<{label: string; value: number}> = [];
  sectionList: Array<{label: string; value: number}> = [];
  dataSource = new MatTableDataSource<ITeacherLeaveApprove>();
  displayedColumns = ['rollNo','studentName','purposeOfLeave', 'dateRangeOfLeave', 'approval', 'remarks'];
  breadcrumbData: IBreadcrumb = {
    title: 'Teacher Leave Approval',
    list: [{
      routerLink: '/teacher-leave-approval',
      subTitle: 'Leave-appproval',
      isRoute: true
  }]
  }
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private studentService: StudentService,
    private dialog: MatDialog,
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

  getStudentLeaveApproval(): void {
    this.spinnerService.show();
    this.studentService.getStudentLeaveForTeacher(
      this.acedemicYearId.value!,
      this.className.value!,
      this.section.value!
    ).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.dataSource.data = res.result!;
        } 
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  resetFilter(): void {
    this.className.reset();
    this.section.reset();
    this.dataSource.data = [];
  }

  openDialog(item: ITeacherLeaveApprove) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent,{
      data:{
        message: `Are you sure want to approve for ${item.studentName}?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.studentService.leaveApprove(
          item.id
        ).subscribe({
          next: (res) => {
            this.spinnerService.dispose();
            if (res.statusCode == HTTP_CODES.SUCCESS) {
              this.snackbar.openSuccessSnackbar(res.result!);
            } 
          },
          error: () => {
            this.spinnerService.dispose();
            item.approval = false;
          }
        })
      }
      else {
        item.approval = false;
      }
    });
  }
}
