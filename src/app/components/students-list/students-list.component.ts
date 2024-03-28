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

export interface PeriodicElement {
  sname: string;
  class: number;
  gender: string;
  section: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {class: 1, sname: 'Anusha', gender: 'Male', section: 'A'},
  {class: 2, sname: 'Sneha', gender: 'Female', section: 'B'},
  {class: 3, sname: 'Ram', gender: 'Male', section: 'C'},
  {class: 4, sname: 'Balu', gender: 'Female', section: 'A'},
  {class: 5, sname: 'Raghav', gender: 'Female', section: 'B'},
  {class: 6, sname: 'Saurav', gender: 'Male', section: 'C'},
  {class: 7, sname: 'Jaswanth', gender: 'Male', section: 'A'},
  {class: 8, sname: 'Dinesh', gender: 'Male', section: 'B'},
  {class: 9, sname: 'Gambir', gender: 'Male', section: 'C'},
  {class: 10, sname: 'Rahul', gender: 'Male', section: 'D'},
];

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
  classList = [
    {value: 1, label: 'I'},
    {value: 2, label: 'II'},
    {value: 3, label: 'III'},
    {value: 4, label: 'IV'},
    {value: 5, label: 'V'},
    {value: 6, label: 'VI'},
    {value: 7, label: 'VII'},
  ];
  sectionList = [
    {value: 'a', label: 'A'},
    {value: 'b', label: 'B'},
    {value: 'c', label: 'C'},
  ];
  statusList = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'},
  ];
  displayedColumns: string[] = ['firstName', 'class', 'section', 'gender', 'action'];
  dataSource = new MatTableDataSource();

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: StudentService,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getStudentList();
  }

  getStudentList() {
    this.service.get().subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
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
}
