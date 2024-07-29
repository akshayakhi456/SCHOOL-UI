import { Component, ViewChild, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { ReceiptsComponent } from '../receipts/receipts.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsComponent } from '../payments/payments.component';
import { StudentService } from '../../shared/services/student/student.service';
import { MatPaginator } from '@angular/material/paginator';
import { SettingsService } from '../../shared/services/settings/settings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ViewPrintReceiptComponent } from '../../shared/components/view-print-receipt/view-print-receipt.component';
import * as xlsx from 'xlsx';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { IStudentGuardianResponse } from '../../shared/models/student.models';

export interface PeriodicElement {
  sname: string;
  class: number;
  gender: string;
  section: string;
}

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss'
})
export class StudentsListComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  sanitizer = inject(DomSanitizer);
  pageSizes = [10, 25, 50, 100];
  classList: any;
  sectionList: any;
  students: any;
  statusList = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'},
  ];
  studentForm = new FormGroup({
    class: new FormControl<string>(''),
    section: new FormControl<string>(''),
    status: new FormControl<string>(''),
    name: new FormControl<string>('')
  })
  globalFilter = '';
  orgSectionList = [];
  displayedColumns: string[] = ['photo', 'firstName', 'class', 'section', 'gender', 'status', 'action'];
  dataSource = new MatTableDataSource();
  breadcrumbData: IBreadcrumb = {
    title: 'Students',
    list: [{
      routerLink: '/student-list',
      subTitle: 'Student-List',
      isRoute: true
  }]
  }

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: StudentService,
    private snackbarService: SnackbarService,
    private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private breadcrumbService: BreadCrumbService,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
    this.dataSource.sort = this.sort;
    this.getClassList();
    this.getSectionList();
    this.getStudentList();

    this.studentForm.controls.class.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter(x => x['className'] == res)
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

  getStudentList() {
    this.spinnerService.show();
    this.service.get().subscribe((res) => {
      this.spinnerService.dispose();
      this.students = res.map((x: any)=>{
        return {
          ...x,
          className: x.classes.className,
          photoExist : x.photo ? true : false,
          photo: 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(x.photo) as any).changingThisBreaksApplicationSecurity
        }
      });
      this.dataSource.data = this.students;
      this.dataSource.paginator = this.paginator;
    },()=>{
      this.spinnerService.dispose();
    })

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

  openReceiptDialog(sudentInfo: any) {
    this.dialog.open(ReceiptsComponent, {
      data: {
        sudentInfo
      },
      width: '60vw'
    });
  }

  openPaymentDialog(sudentInfo: any) {
    this.dialog.open(PaymentsComponent,{
      data: {
        sudentInfo
      }
    });
  }

  filterChanges() {
    const form = this.studentForm.value;

    this.dataSource.data = this.students.filter((x: any) => 
      (form.name == '' || x.firstName.toLowerCase().includes(form.name?.toLowerCase()) ||
      x.lastName.toLowerCase().includes(form.name?.toLowerCase()) ||
      x.id == form.name) &&
      ((form.class?.toString() == '' || x.className.toString() == form.class)) &&
      ((form.section == '' || x.section == form.section)) &&
      ((form.status == '' || x.status == form.status))
    )
  }

  resetForm() {
    this.studentForm.patchValue({
      name: '',
      status: '',
      class: '',
      section: ''
    });
    this.dataSource.data = this.students;
  }

  openAdmissionForm(stdId: number) {
    this.dialog.open(ViewPrintReceiptComponent, {
      data: {
        id: stdId
      }
    });
  }

  selectFile(e: any): void {
    const file = e.target.files[0];
    let fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = () => {
      let data = fr.result;
      let workbook = xlsx.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheetName];
      const json: any = xlsx.utils.sheet_to_json(sheet1, {raw: false});
      e.target.value = '';
      const studentguardian: Array<IStudentGuardianResponse> = [];
      for (let i = 0; i < json.length; i++) {
        const students = {
          id: 0,
          className: this.classList.find((x: any)=> x.label == json[i]?.Class).label ?? '',
          photo: '',
          currentClassName: 0,
          firstName: json[i].FirstName,
          lastName: json[i]?.LastName,
          dob: json[i]?.DateOfBirth.toString(),
          classesId: this.classList.find((x: any)=> x.label == json[i]?.Class).value ?? '',
          section: '',
          gender: json[i]?.Gender,
          status: true,
          adharNumber: json[i]?.AadharNumber.toString(),
          sibilings: '',
          certificateNames: json[i]?.CertificateName ? JSON.stringify(json[i]?.CertificateName?.split(',')) : '',
          dateOfJoining: new Date(json[i]?.DateOfJoining).toISOString(),
        };
        const fatherInfo = {
          id: 0,
          firstName: json[i]?.FirstName_1,
          lastName: json[i]?.LastName_1,
          occupation: json[i]?.Occupation,
          qualification: json[i]?.Qualification,
          contactNumber: json[i]?.ContactNumber,
          email: json[i]?.Email,
          adharNumber: json[i]?.AadharNumber_1.toString(),
          studentId: null,
          relationship: 'Father'
        }
        const motherInfo = {
          id: 0,
          firstName: json[i]?.FirstName_2,
          lastName: json[i]?.LastName_2,
          occupation: json[i]?.Occupation_1,
          qualification: json[i]?.Qualification_1,
          contactNumber: json[i]?.ContactNumber_1,
          email: json[i]?.Email_1,
          adharNumber: json[i]?.AadharNumber_2.toString(),
          studentId: null,
          relationship: 'Mother'
        }
        const addressInfo = {
          id: 0,
          HouseNo: json[i]?.HouseNo.toString(),
          streetName: json[i]?.Street,
          city: json[i]?.City,
          district: json[i]?.District,
          state: json[i]?.State,
          zipCode: json[i]?.PinCode.toString(),
          country: json[i]?.Country,
          studentId: 0
        }
        studentguardian.push({
          students,
        guardians: [
          fatherInfo,
          motherInfo
        ],
        address: addressInfo
        })
      }
      this.spinnerService.show();
      this.service.postBulkUpload(studentguardian).subscribe({
        next: (res) => {
          this.spinnerService.dispose();
          this.snackbarService.openSuccessSnackbar(res.result!);
          this.getStudentList();
        },
        error:() => {
          this.spinnerService.dispose();
        }
      })
    }
  }
}
