import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { SaveExpensesComponent } from '../save-expenses/save-expenses.component';
import { ExpensesService } from '../../shared/services/expenses/expenses.service';
import { MatPaginator } from '@angular/material/paginator';

export interface IExpenses {
  amount: string;
  miscellanous: string;
  remark: string;
  doe: string
}

const ELEMENT_DATA: IExpenses[] = [
  {doe: '1/2/2024', amount: '1000', miscellanous: 'Cash', remark: 'On time'},
  {doe: '1/2/2024', amount: '200', miscellanous: 'Cheque', remark: 'Cheque  clearance'},
  {doe: '1/2/2024', amount: '400', miscellanous: 'UPI', remark: 'Delay'},
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
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  displayedColumns: string[] = ['miscellanous', 'doe', 'amount', 'remarks'];
  dataSource = new MatTableDataSource();

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: ExpensesService,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getExpenses();
  }

  getExpenses() {
    this.service.get().subscribe({
      next: res => {
        this.dataSource.data = res.result ?? res;
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
    this.dialog.open(SaveExpensesComponent);
  }
}
