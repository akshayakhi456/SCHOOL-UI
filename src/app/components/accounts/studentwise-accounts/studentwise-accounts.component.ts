import { Component, TemplateRef, ViewChild, effect, inject } from '@angular/core';
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
import { GlobalService } from '../../../shared/signal-service/global.service';

@Component({
  selector: 'app-studentwise-accounts',
  standalone: true,
  imports: [SharedModule, CommonModule, InvoiceReceiptComponent],
  templateUrl: './studentwise-accounts.component.html',
  styleUrl: './studentwise-accounts.component.scss'
})
export class StudentwiseAccountsComponent {
  @ViewChild('paginator') paginator!: MatPaginator | null;
  @ViewChild('studentSearchList') studentSearchList! : TemplateRef<any>;
  studentDataSource = new MatTableDataSource();
  stdId = new FormControl();
  selectAllReceipts = new FormControl();
  pageSizes = [10, 50, 100];
  receiptRecord = true;
  stdInfo: any;
  selectedReceipt: any;
  displayedColumns: string[] = ['checkbox', 'invoiceId', 'paymentName', 'paymentAllotmentAmount', 'amount', 'paymentType', 'dateOfPayment', 'remarks'];
  studentDisplayedColumns: string[] = ['firstName', 'class', 'section', 'action'];
  completeStudentList = [];
  dataSource = new MatTableDataSource();
  originalReceipt: any;
  isSingleReceipt = false;
  router = inject(Router);

  constructor(private paymentService: PaymentsService,
    private studentService: StudentService,
    private spinnerService: SpinnerService,
    private snackbar: SnackbarService,
    private globalService: GlobalService,
    private dialog: MatDialog
  ) {
    effect(() => {
      this.stdId.setValue(this.globalService.selectedStudentIdForDetails());
      if (this.stdId.value) {
        this.getStudentById();
      }
    })
  }

  ngOnInit(): void {

  }

  getStdInfo() {
    if (this.stdId.value) {
      this.getStudentById();
    }
  }

  getStudentById(): void {
    this.spinnerService.show();
    this.studentService.getByKey(this.stdId.value).subscribe({
      next: res => {
        this.spinnerService.dispose();
        this.completeStudentList = res;
        this.studentDataSource = res.map((x: any) => x.students);
        this.openStudentPayment();
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  openStudentPayment() {
    const dialog = this.dialog.open(this.studentSearchList, {
      width: '40vw',
      disableClose: true,
    })
  }

  studentData(element: any) {
    this.stdInfo = this.completeStudentList.filter((std: any) => std.students.id == element.id)[0];
    this.getReceiptList();
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
      },
    })
  }

}
