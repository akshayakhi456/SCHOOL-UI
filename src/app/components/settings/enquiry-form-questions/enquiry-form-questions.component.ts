import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnquiryService } from '../../../shared/services/enquiry/enquiry.service';
import { MatPaginator } from '@angular/material/paginator';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry-form-questions',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './enquiry-form-questions.component.html',
  styleUrl: './enquiry-form-questions.component.scss'
})
export class EnquiryFormQuestionsComponent {
  @ViewChild('callAPIDialog') callAPIDialog!: TemplateRef<any>;
  @ViewChild('paginator') paginator!: MatPaginator | null;
  dataTypeList = ['text', 'dropdown'];
  pageSizes = [10, 25, 50, 100];
  displayedColumns: string[] = ['firstName', 'className', 'guardian', 'action'];
  dataSource = new MatTableDataSource();
  questionForm = new FormGroup({})
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

  addQuestion() {
    this.dialog.open(this.callAPIDialog);
  }
}
