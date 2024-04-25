import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { SaveExpensesComponent } from '../save-expenses/save-expenses.component';
import { ExpensesService } from '../../shared/services/expenses/expenses.service';
import { MatPaginator } from '@angular/material/paginator';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { IBreadcrumb } from '../../shared/interfaces/global.model';

export interface IExpenses {
  amount: string;
  miscellanous: string;
  remark: string;
  doe: string
}

const ELEMENT_DATA: IExpenses[] = [
  { doe: '1/2/2024', amount: '1000', miscellanous: 'Cash', remark: 'On time' },
  { doe: '1/2/2024', amount: '200', miscellanous: 'Cheque', remark: 'Cheque  clearance' },
  { doe: '1/2/2024', amount: '400', miscellanous: 'UPI', remark: 'Delay' },
];

@Component({
  selector: 'app-school-expenses',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [SharedModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './school-expenses.component.html',
  styleUrl: './school-expenses.component.scss'
})
export class SchoolExpensesComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  pageSizes = [10, 25, 50, 100];
  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });

  displayedColumns: string[] = ['miscellanous', 'doe', 'amount', 'remarks'];
  dataSource = new MatTableDataSource();
  orgDataSource: any;
  breadcrumbData: IBreadcrumb = {
    title: 'Expenses',
    list: [{
      routerLink: '/expenses',
      subTitle: 'Expenses-List',
      isRoute: true
    }]
  }

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: ExpensesService,
    private breadcrumbService: BreadCrumbService,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    public dialog: MatDialog) {
      this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
      this.french();
  }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getExpenses();
  }

  french() {
    this._locale = 'fr';
    this._adapter.setLocale(this._locale);
    this.updateCloseButtonLabel('Fermer le calendrier');
  }

  updateCloseButtonLabel(label: string) {
    this._intl.closeCalendarLabel = label;
    this._intl.changes.next();
  }


  getExpenses() {
    this.service.get().subscribe({
      next: res => {
        this.dataSource.data = res.result ?? res;
        this.orgDataSource = res.result ?? res;
        this.dataSource.paginator = this.paginator;
      }
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

  openExpenses() {
    const dialog = this.dialog.open(SaveExpensesComponent);
    dialog.afterClosed().subscribe(() => {
      this.getExpenses();
    })
  }

  filterByDate() {
    this.range.markAllAsTouched();
    if (this.range.invalid) {
      return;
    }
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;

    const filteredData = this.orgDataSource.filter((d: any) => new Date(d['doe']) >= startDate! && new Date(d['doe']) <= endDate!)
    this.dataSource.data = filteredData;
  }

  reset() {
    this.range.reset();
    this.dataSource.data = this.orgDataSource;
  }
}
