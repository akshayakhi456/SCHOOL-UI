import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnquiryService } from '../../shared/services/enquiry/enquiry.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './enquiry-list.component.html',
  styleUrl: './enquiry-list.component.scss'
})
export class EnquiryListComponent {
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
  searchForm = new FormGroup({
    name: new FormControl<string>(''),
    className: new FormControl<string>(''),
    status: new FormControl<boolean>(false)
  })
  displayedColumns: string[] = ['firstName', 'className', 'guardian', 'action'];
  dataSource = new MatTableDataSource();

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: EnquiryService,
    private router: Router,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getEnquiryList();
  }

  getEnquiryList() {
    this.service.get().subscribe((res) => {
      this.dataSource.data = res.result;
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

  editEnquiryForm(data: any): void {
    this.router.navigate(['enquiry', data.id])
  }
}