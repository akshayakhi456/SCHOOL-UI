import { Component, ElementRef, Inject, Input, ViewChild, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../services/settings/settings.service';
import { StudentService } from '../../services/student/student.service';
import { BreadCrumbService } from '../../signal-service/breadcrumb.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-print-receipt',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './view-print-receipt.component.html',
  styleUrl: './view-print-receipt.component.scss'
})
export class ViewPrintReceiptComponent {
  @Input() stdId: number = 0;
  @ViewChild('receipt') receipt!: ElementRef;
  todayDate = new Date();
  service = inject(StudentService);
  settingService = inject(SettingsService);
  spinnerService = inject(SpinnerService);
  snackbar = inject(MatSnackBar);
  activatedRoute = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);
  spinner = inject(SpinnerService);
  breadcrumbService = inject(BreadCrumbService);
  imgViewer = '';
  selectedStudents: any;
  certificateList: any;
  fatherInfo: any;
  motherInfo: any;
  studentForm: any;
  address: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: number}){
    this.stdId = data.id;
  }

  ngOnInit() {
    if(this.stdId > 0){
      this.getStudentById(this.stdId);
    }
  }

  getStudentById(id: number) {
    this.spinner.show();
    this.service.getById(id).subscribe({next: res => {
      this.spinner.dispose();
      const result = res.result ?? res;
      const studentPhoto = result.students.photo;
      const studentBase64Photo = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(studentPhoto) as any).changingThisBreaksApplicationSecurity;
      this.studentForm = result.students;
      this.imgViewer = studentBase64Photo;
      this.fatherInfo = result.guardians.find((f: any) => f.relationship === 'Father');
      this.motherInfo = result.guardians.find((f: any) => f.relationship === 'Mother');
      this.address = result.address;
    },
    error: () => {
      this.spinner.dispose();
    }
  })
  }

  downloadReceipt(): void {
    let data: any = this.receipt.nativeElement;
    if(this.isMobile() && data){
      const viewportMetaTag = document.querySelector('meta[name="viewport"]') as any;
      viewportMetaTag.setAttribute('content', '');
      setTimeout(() => {
        this.spinnerService.show();
        this.downloadPDF(true, viewportMetaTag, data);
      }, 0);
    }else{
      this.downloadPDF(false,null, data);
    }
  }

  // this code for creating PDF START
  downloadPDF(isMobile = false, viewportMetaTag: any = null, canvasData: any =null): void {
    html2canvas(canvasData).then((canvas) => {
      try {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', 'a4', true);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = 410//pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 20, 0, pdfWidth, pdfHeight);
        pdf.save('download.pdf');
        this.spinnerService.dispose();
        if(isMobile){
          setTimeout(() => {
            viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1');
            this.spinnerService.dispose();

          }, 0);
        }
      }
      catch {
        this.spinnerService.dispose();
      }
      finally {
        this.spinnerService.dispose();
      }
    });
  }
  // this code for creating PDF ENDS

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

}
