import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SharedModule } from '../../shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { SnackbarService } from '../../signal-service/snackbar.service';
import { TitleHeadingService } from '../../services/title-heading/title-heading.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-invoice-receipt',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './invoice-receipt.component.html',
  styleUrl: './invoice-receipt.component.scss'
})
export class InvoiceReceiptComponent {
  @Input() stdInfo: any;
  @Input() receiptList: any;
  @ViewChild('receipt') receipt!: ElementRef;
  @ViewChild('exampleModal') modal!: ElementRef;
  htmlContent!: SafeHtml;
  img!: string;
  today = new Date();
  invoiceId = 0;

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

  ngAfterViewInit() {
    this.getInvoiceId();
    this.getTitle();
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

  getInvoiceId() {
    this.spinnerService.show();
    this.service.getInvoiceId().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if(res.statusCode == 200) {
          this.invoiceId = Number(res.result) + 1;
          this.downloadReceipt(true);
        }
      },
      error: () => {this.spinnerService.dispose();}
    })
  }

  downloadReceipt(saveDB = false): void {
    let data: any = this.receipt.nativeElement;
    if(this.isMobile() && data){
      const viewportMetaTag = document.querySelector('meta[name="viewport"]') as any;
      viewportMetaTag.setAttribute('content', '');
      setTimeout(() => {
        // this.ngxService.start();
        this.downloadPDF(true, viewportMetaTag, data, saveDB);
      }, 0);
    }else{
      this.downloadPDF(false,null, data, saveDB);
    }
  }

  // this code for creating PDF START
  downloadPDF(isMobile = false, viewportMetaTag: any = null, canvasData: any =null, saveDB: boolean): void {
    html2canvas(canvasData).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4', true);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 410//pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 0, pdfWidth, pdfHeight);
      if (saveDB) {
        this.generateReceipt(imgData, viewportMetaTag, isMobile);
      }
      else {
        this.download(pdf, viewportMetaTag);
      }
    });
  }
  // this code for creating PDF ENDS

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  generateReceipt(base64Data: string, viewportMetaTag: any, isMobile: any) {
    const formData = new FormData();
    formData.append('file', base64Data.split(',')[1]);
    formData.append('invoice', JSON.stringify({
      invoiceId: this.invoiceId,
      studentId: this.stdInfo.id
    }))
    this.spinnerService.show();
    this.service.postInvoice(formData).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode === 200) {
          this.snackbar.openSuccessSnackbar(res.message);
          if(isMobile){
            setTimeout(() => {
              viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1');
              // this.ngxService.stop();
            }, 0);
          }
        }
      },
      error: () => {
        this.spinnerService.dispose();
        if(isMobile){
          setTimeout(() => {
            viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1');
            // this.ngxService.stop();
          }, 0);
        }
      }
    })
  }

  download(pdf: any, viewportMetaTag: any) {
    pdf.save(`${this.stdInfo!.firstName}_${this.stdInfo!.lastName}.pdf`);
    viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1');
  }
}
