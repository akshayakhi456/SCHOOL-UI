import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InvoiceReceiptComponent } from '../../../shared/components/invoice-receipt/invoice-receipt.component';
import { InvoiceService } from '../../../shared/services/invoice/invoice.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TitleHeadingService } from '../../../shared/services/title-heading/title-heading.service';

@Component({
  selector: 'app-bulk-receipt',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './bulk-receipt.component.html',
  styleUrl: './bulk-receipt.component.scss'
})
export class BulkReceiptComponent {
  @Input() stdInfo: any;
  @Input() receiptList: any;
  @ViewChild('receipt') receipt!: ElementRef;
  @ViewChild('exampleModal') modal!: ElementRef;

  today = new Date();
  invoiceId = 0;
  htmlContent!: SafeHtml;
  img!: string;
  constructor(private service: InvoiceService,
    private spinnerService: SpinnerService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<InvoiceReceiptComponent>,
    private titleHeadingService: TitleHeadingService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.stdInfo = data.stdInfo;
      this.receiptList = data.receiptList;
    }

  ngOnInit() {
    this.getInvoiceId();
    this.getTitle();
  }

  getInvoiceId() {
    this.spinnerService.show();
    this.service.getInvoiceId().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if(res.statusCode == 200) {
          this.invoiceId = Number(res.result) + 1;
        }
      },
      error: () => {this.spinnerService.dispose();}
    })
  }

  downloadReceipt(): void {
    let data: any = this.receipt.nativeElement;
    if(this.isMobile() && data){
      const viewportMetaTag = document.querySelector('meta[name="viewport"]') as any;
      viewportMetaTag.setAttribute('content', '');
      setTimeout(() => {
        // this.ngxService.start();
        this.downloadPDF(true, viewportMetaTag, data);
      }, 0);
    }else{
      this.downloadPDF(false,null, data);
    }
  }

  // this code for creating PDF START
  downloadPDF(isMobile = false, viewportMetaTag: any = null, canvasData: any =null): void {
    html2canvas(canvasData).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4', true);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 410//pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.stdInfo!.firstName}_${this.stdInfo!.lastName}.pdf`);
      viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1');
    });
  }
  // this code for creating PDF ENDS

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  capitalizeBeforeSpace(text: string | unknown): string {
    if (typeof text == 'string') {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.toUpperCase() === char && i > 0 && text[i - 1] !== ' ') {
          result += ' ';
        }
        result += char.toUpperCase();
      }
      return result;
    }
    return '';
  }
  
  getTitle(): void {
    this.spinnerService.show();
    this.titleHeadingService.getByQueryTitleHeader('receipt').subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.img = this.returnBase64(res.result?.photo!);
        this.htmlContent = this.returnHTML(res.result?.description!);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
  returnBase64(photo: string): string{
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(photo) as any).changingThisBreaksApplicationSecurity
  }
  returnHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
