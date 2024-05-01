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
import { SettingsService } from '../../shared/services/settings/settings.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { CommonModule } from '@angular/common';
import { AlertmessageService } from '../../shared/services/alert-message/alertmessage.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { EnquiryFeedbackComponent } from './enquiry-feedback/enquiry-feedback.component';

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './enquiry-list.component.html',
  styleUrl: './enquiry-list.component.scss'
})
export class EnquiryListComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  pageSizes = [10, 25, 50, 100];
  enquiryList: any;
  classList = [
    {value: 1, label: 'I'},
    {value: 2, label: 'II'},
    {value: 3, label: 'III'},
    {value: 4, label: 'IV'},
    {value: 5, label: 'V'},
    {value: 6, label: 'VI'},
    {value: 7, label: 'VII'},
  ];
  statusList = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'},
  ];
  searchForm = new FormGroup({
    name: new FormControl<string>(''),
    className: new FormControl<string>(''),
    status: new FormControl<boolean | null>(null)
  })
  displayedColumns: string[] = ['firstName', 'className', 'guardian', 'status', 'action'];
  dataSource = new MatTableDataSource();
  breadcrumbData: IBreadcrumb = {
    title: 'Enquiry',
    list: [{
      routerLink: '/enquiry-list',
      subTitle: 'Enquiry-List',
      isRoute: true
  }]
  }

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: EnquiryService,
    private spinnerService: SpinnerService,
    private breadcrumbService: BreadCrumbService,
    private router: Router,
    private settingService: SettingsService,
    private snackbar: SnackbarService,
    private alertMessageService: AlertmessageService,
    public dialog: MatDialog) {
      this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData)
    }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getEnquiryList();
    this.getClassList();
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

  getEnquiryList() {
    this.spinnerService.show();
    this.service.get().subscribe({next:(res) => {
      this.spinnerService.dispose();
      this.dataSource.data = res.result;
      this.enquiryList = res.result;
      this.dataSource.paginator = this.paginator;
      this.filterChanges();
    },error:()=>{
      this.spinnerService.dispose();
    }})

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

  filterChanges() {
    const form = this.searchForm.value;

    this.dataSource.data = this.enquiryList.filter((x: any) => 
      (form.name == '' || x.firstName.toLowerCase().includes(form.name?.toLowerCase()) ||
      x.lastName.toLowerCase().includes(form.name?.toLowerCase()) ||
      x.id == form.name) &&
      ((form.className?.toString() == '' || x.className.toString() == form.className)) &&
      ((form.status == null || x.status == form.status))
    )
  }

  changeStatusOfStudent(element: any): void {
    const payload = {
      title: 'Enquiry Status',
      body: `Do you want to change Status of ${element.firstName} ${element.lastName} ?`
    }
    const dialogRef = this.alertMessageService.openSuccessWithSubscriber(payload);
    dialogRef.dialogResult$.subscribe((res: boolean) =>{
      if(res) {
        this.spinnerService.show();
        this.service.changeStatusEnquiryStudent(element.id, !element.status).subscribe({
          next: (res: any) =>{
            this.spinnerService.dispose();
            if (res.statusCode == 200){
              this.snackbar.openSuccessSnackbar(res.message);
              this.getEnquiryList();
            }
          },
          error:() =>{
            this.spinnerService.dispose();
          }
        })
      }
    })
  }

  feedbackForm(id: number): void {
    this.dialog.open(EnquiryFeedbackComponent, {
      data: id
    });
  }
}
