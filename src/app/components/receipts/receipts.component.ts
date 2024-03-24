import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from '../../shared/services/payments/payments.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface IReceiptList {
  amount: string;
  admissionNo: number;
  paymentMode: string;
  remarks: string;
  DOP: string;
}

const ELEMENT_DATA: IReceiptList[] = [
  {admissionNo: 1, DOP: '1/2/2024', amount: '1000', paymentMode: 'Cash', remarks: 'On time'},
  {admissionNo: 2, DOP: '1/2/2024', amount: '200', paymentMode: 'Cheque', remarks: 'Cheque  clearance'},
  {admissionNo: 3, DOP: '1/2/2024', amount: '400', paymentMode: 'UPI', remarks: 'Delay'},
];
@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [CommonModule,
  SharedModule],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss'
})
export class  ReceiptsComponent {
  @ViewChild('receipt') receipt!: ElementRef;
  receiptRecord = true;
  stdInfo: any;
  selectedReceipt: any;
  todayDate = new Date();
  displayedColumns: string[] = ['invoiceId', 'feeName', 'dateOfPayment', 'amount', 'paymentType', 'remarks', 'action'];
  dataSource = new MatTableDataSource();
  originalReceipt: any;
  isSingleReceipt = false;

  constructor(private service: PaymentsService,
    public dialogRef: MatDialogRef<ReceiptsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.stdInfo = this.data.sudentInfo;
    this.getReceiptList();
  }

  getReceiptList(): void{
    this.service.getReceiptById(this.stdInfo.id).subscribe({next: res => {
      this.dataSource.data = res.result ?? res;
      this.originalReceipt = res.result ?? res;
    },
    error: () =>{}
  })
  }

  openReceiptPreview(selectedReceiptData: any) {
    this.receiptRecord = false;
    this.selectedReceipt = selectedReceiptData;
    this.isSingleReceipt = true;
  }

  downloadReceipt(): void {
    html2canvas(this.receipt.nativeElement).then(canvas => {
      // Few necessary setting options
      var imgWidth = 192;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      pdf.addImage(contentDataURL, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${this.stdInfo.firstName}_${this.stdInfo.lastName}.pdf`); // Generated PDF
    });
  }
}
