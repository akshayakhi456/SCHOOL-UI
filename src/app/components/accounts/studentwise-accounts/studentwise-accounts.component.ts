import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { StudentService } from '../../../shared/services/student/student.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { FormControl } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceReceiptComponent } from '../../../shared/components/invoice-receipt/invoice-receipt.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';

@Component({
  selector: 'app-studentwise-accounts',
  standalone: true,
  imports: [SharedModule, CommonModule, InvoiceReceiptComponent],
  templateUrl: './studentwise-accounts.component.html',
  styleUrl: './studentwise-accounts.component.scss'
})
export class StudentwiseAccountsComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  // @ViewChild(InvoiceReceiptComponent) invoiceReceiptComponent!: InvoiceReceiptComponent;
  stdId = new FormControl();
  selectAllReceipts = new FormControl();
  pageSizes = [10, 50, 100];
  receiptRecord = true;
  stdInfo: any;
  selectedReceipt: any;
  displayedColumns: string[] = ['checkbox', 'invoiceId', 'paymentName', 'paymentAllotmentAmount', 'amount', 'paymentType', 'dateOfPayment', 'remarks'];
  dataSource = new MatTableDataSource();
  originalReceipt: any;
  isSingleReceipt = false;
  router = inject(Router);

  constructor(private paymentService: PaymentsService,
    private studentService: StudentService,
    private spinnerService: SpinnerService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
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
      this.originalReceipt = result.map((x: any) => {
        return {
          ...x,
          checkbox: false
        }
      })
      this.dataSource.data = this.originalReceipt;
      this.dataSource.paginator = this.paginator;
    },
    error: () =>{
      this.spinnerService.dispose();
    }
  })
  }

  redirectToPayment(): void {
    this.router.navigate(['payment',this.stdInfo?.students.id])
  }

  generateAllReceipt(): void {
    this.dataSource.data = this.originalReceipt.map((x: any) => {
      return {
        ...x,
        checkbox: this.selectAllReceipts.value
      }
    })
  }

  openReceipt(): void {
    const receiptFor = this.dataSource.data.filter((data: any) => data.checkbox);
    if (!(receiptFor && receiptFor.length)) {
      this.snackbar.openWarningSnackbar('Please select atleast one receipt');
      return;
    }
    const stdInfo = {
      ...this.stdInfo.students,
      father: this.stdInfo.guardians.find((x: {relationship: string})=>x.relationship === 'Father')
    }
    this.dialog.open(InvoiceReceiptComponent, {
      data: {
        stdInfo,
        receiptList: receiptFor
      }
    })
  }

}
