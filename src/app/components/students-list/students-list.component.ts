import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { ReceiptsComponent } from '../receipts/receipts.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsComponent } from '../payments/payments.component';
import { StudentService } from '../../shared/services/student/student.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { SettingsService } from '../../shared/services/settings/settings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';

export interface PeriodicElement {
  sname: string;
  class: number;
  gender: string;
  section: string;
}

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss'
})
export class StudentsListComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
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
  displayedColumns: string[] = ['firstName', 'class', 'section', 'gender', 'action'];
  dataSource = new MatTableDataSource();

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: StudentService,
    private spinnerService: SpinnerService,
    private settingService: SettingsService,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
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
      this.dataSource.data = res;
      this.students = res;
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
}
