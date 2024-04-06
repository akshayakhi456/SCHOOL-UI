import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { FormControl } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-studentwise-accounts',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './studentwise-accounts.component.html',
  styleUrl: './studentwise-accounts.component.scss'
})
export class StudentwiseAccountsComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  stdId = new FormControl();
  pageSizes = [10, 50, 100];
  receiptRecord = true;
  stdInfo: any;
  selectedReceipt: any;
  displayedColumns: string[] = ['invoiceId', 'paymentName', 'paymentAllotmentAmount', 'amount', 'paymentType', 'dateOfPayment', 'remarks'];
  dataSource = new MatTableDataSource();
  originalReceipt: any;
  isSingleReceipt = false;

  constructor(private paymentService: PaymentsService,
    private studentService: StudentService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
  }

  getStdInfo() {
    if (this.stdId.value) {
      this.getStudentById();
    }
  }

  getStudentById(): void {
    this.spinnerService.show();
    this.studentService.getById(this.stdId.value).subscribe({
      next: res => {
        this.spinnerService.dispose();
        this.stdInfo = res.result ?? res;
        this.getReceiptList();
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  getReceiptList(): void{
    this.spinnerService.show();
    this.paymentService.getReceiptById(this.stdInfo.students.id).subscribe({next: res => {
      this.spinnerService.dispose();
      let result = res.result ?? res;
      this.dataSource.data = result;
      this.dataSource.paginator = this.paginator;
    },
    error: () =>{
      this.spinnerService.dispose();
    }
  })
  }

}
