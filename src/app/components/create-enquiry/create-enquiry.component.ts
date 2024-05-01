import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnquiryService } from '../../shared/services/enquiry/enquiry.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { SettingsService } from '../../shared/services/settings/settings.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceReceiptComponent } from '../../shared/components/invoice-receipt/invoice-receipt.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Component({
  selector: 'app-create-enquiry',
  standalone: true,
  imports: [SharedModule, NgxMaskDirective, NgxMaskPipe, StarRatingComponent],
  templateUrl: './create-enquiry.component.html',
  styleUrl: './create-enquiry.component.scss',
  providers: [provideNgxMask()]
})
export class CreateEnquiryComponent {
  @ViewChild('receipt') receipt!: ElementRef;
  paymentStatusList = ['Pending', 'Completed'];
  id = 0;
  hourList = ['09', '10', '11', '12', '13', '14', '15', '16', '17'];
  minutesList = ['00', '15', '30', '45'];
  paymentModeList: Array<string> = ['Cash', 'Card', 'Cheque', 'Online'];
  isOpenReceipt = false;
  generateReceiptBtn = false;
  saveParentInteraction = false;
  rating = new FormControl();
  review = new FormControl();
  questionList: Array<any> = [];
  abc = [{
      question: "How well you know hindi?",
      type: "dropdown",
      isRequired: true,
      options: ["Speak","Write","Read"],
      isMultiple: true,
      formControlName: "hindiQuestion"
    },
    {
      question: "How well you know English?",
      type: "dropdown",
      isRequired: true,
      options: ["Speak","Write","Read"],
      isMultiple: false,
      formControlName: "englishQuestion"
    },
    {
      question: "How well you know English?",
      type: "text",
      isRequired: true,
      options: null,
      isMultiple: false,
      formControlName: "textFill"
    },
  ]

  parentInteractionForm = new FormGroup({});

  enquiryForm = new FormGroup({
    id: new FormControl<number>(0),
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    dob: new FormControl<string>('', Validators.required),
    mobile: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
    guardian: new FormControl<string>('', Validators.required),
    className: new FormControl<string>('', Validators.required),
    reference: new FormControl<string>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
    status: new FormControl<boolean>(true),
    previousSchoolName: new FormControl<string>('', Validators.required),
    parentInteraction: new FormControl<string>(''),
    rating: new FormControl<number | null>(null),
    review: new FormControl<string>('')
  });

  registrationForm = new FormGroup({
    id: new FormControl<number>(0),
    dateOfExam: new FormControl<Date>(new Date()),
    modeOfExam: new FormControl<string>('Offline'),
    hours: new FormControl<string>(''),
    mins: new FormControl<string>(''),
    enquiryStudentId: new FormControl<string>('0')
  })

  enquiryPaymentForm = new FormGroup({
    invoiceId: new FormControl<number>(0),
    feeName: new FormControl<string>('Entrance Test'),
    paymentType: new FormControl<string>('', Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    remarks: new FormControl<string>('NA'),
    dateOfPayment: new FormControl<Date>(new Date()),
    studentEnquireId: new FormControl<number>(0),
    paymentStatus: new FormControl<string>('Pending'),
  })

  classList = [
    { value: '1', label: 'I' },
    { value: '2', label: 'II' },
    { value: '3', label: 'III' },
    { value: '4', label: 'IV' },
    { value: '5', label: 'V' },
    { value: '6', label: 'VI' },
    { value: '7', label: 'VII' },
  ];

  statusList = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  get enquiryFormControls(): { [key: string]: AbstractControl } {
    return this.enquiryForm.controls;
  }

  get paymentFormControls(): { [key: string]: AbstractControl } {
    return this.enquiryPaymentForm.controls;
  }

  constructor(private service: EnquiryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private settingService: SettingsService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackbarService: SnackbarService) {
      this.french();
     }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'] ? 
    this.activatedRoute.snapshot.params['id'] : 0;
    if (this.id) {
      this.getEnquiryQuestionList();
    }    
    this.getClassList();
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

  getEnquiryQuestionList() {
    this.spinnerService.show();
    this.settingService.getEnquiryQuestionsSettings().subscribe((res) => {
      this.spinnerService.dispose();
      this.questionList = res.result.map((x: any) => {
        if(x.type == 'dropdown' && x.isMultiple) {
          return {...x, options: JSON.parse(x.options).map((opt: any) => opt.option)}
        }
        return x
      });
      this.parentInteractionFormControls();
      this.getEnquireFormById();
    },()=>{
      this.spinnerService.dispose();
    })

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

  parentInteractionFormControls() {
    for (let i=0; i< this.questionList.length; i++){
      this.parentInteractionForm.addControl(
        this.questionList[i].formControlName,
        this.questionList[i].isRequired ? new FormControl('', Validators.required) :new FormControl('')
        );
      this.parentInteractionForm.updateValueAndValidity();
    }
  }

  get parentInteractionControls(): {[key: string]: AbstractControl<any>} {
    return this.parentInteractionForm.controls;
  }

  getEnquireFormById(): void {
    this.enquiryPaymentForm.patchValue({studentEnquireId: this.id});
    this.spinnerService.show();
    this.service.getById(this.id).subscribe({
      next: res => {
      this.spinnerService.dispose();
        if(res){
          this.enquiryForm.patchValue(res.result.enquiry ?? res.enquiry);
          this.registrationForm.patchValue({
            ...res.result.enquiryEntranceExam ?? res.enquiryEntranceExam,
            hours: res.result.enquiryEntranceExam.scheduleTimeForExam.split(':')[0],
            mins: res.result.enquiryEntranceExam.scheduleTimeForExam.split(':')[1],
          });
          if(res.result.paymentsEnquiry ?? res.paymentsEnquiry) {
            this.enquiryPaymentForm.patchValue(res.result.paymentsEnquiry ?? res.paymentsEnquiry);
            this.generateReceiptBtn = this.enquiryPaymentForm.value.paymentStatus === 'Completed'
          }
          if (res.result.enquiry.parentInteraction ?? res.enquiry.parentInteraction) {
            this.parentInteractionForm.patchValue({
              ...JSON.parse(res.result.enquiry.parentInteraction) ?? JSON.parse(res.enquiry.parentInteraction)
            });
            this.parentInteractionForm.disable();
            this.saveParentInteraction = true;
          }
          if (res.result.enquiry?.rating) {
            this.rating.setValue(res.result.enquiry.rating)
          }
          if (res.result.enquiry?.review) {
            this.review.setValue(res.result.enquiry.review)
          }
        }
      },
      error: ()=>{
      this.spinnerService.dispose();
      }
    })
  }

  onSubmit(ParentSave = false) {
    const entranceExam = this.registrationForm.value;
    let payload = {
      enquiry: this.enquiryForm.value,
      enquiryEntranceExam: {
        id: entranceExam.id,
        dateOfExam: new Date(entranceExam.dateOfExam || '').toISOString(),
        modeOfExam: entranceExam.modeOfExam,
        scheduleTimeForExam: `${entranceExam.hours}:${entranceExam.mins}`,
        enquiryStudentId: `${entranceExam.enquiryStudentId}`
      }
    }
    if (this.id == 0) {
      this.spinnerService.show();
      this.service.create(payload).subscribe({next: (res: any) => {
      this.spinnerService.dispose();
        if (res && res.result && res.result.id) {
          this.id = res.result.id;
          this.router.navigate(['enquiry', this.id]);
          this.snackbarService.openSuccessSnackbar(res.message)
          this.saveParentInteraction = true;
        }
      },error: ()=>{
      this.spinnerService.dispose();
      }})
    }
    else {
      this.spinnerService.show();
      this.service.update(payload).subscribe((res: any) => {
      this.spinnerService.dispose();
        if (res) {
          this.snackbarService.openSuccessSnackbar(res.message)
          if (ParentSave){
            this.saveParentInteraction = true;
          }
        }
      },()=>{
      this.spinnerService.dispose();
      })
    }
  }

  savePayments(): void {
    this.enquiryPaymentForm.markAllAsTouched();
    if (this.enquiryPaymentForm.invalid){
      return;
    }
    this.spinnerService.show();
    this.service.createPayment(this.enquiryPaymentForm.value).subscribe({
      next: (res: any) => {
      this.spinnerService.dispose();
        this.generateReceiptBtn = this.enquiryPaymentForm.value.paymentStatus === 'Completed';
        this.snackbarService.openSuccessSnackbar(res.message)
      },
      error: () => { 
      this.spinnerService.dispose();
      }
    })
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }
  goForward(stepper: MatStepper, stepNumber: number) {
    this.enquiryForm.markAllAsTouched();
    if (stepNumber == 1 && this.enquiryForm.invalid) {
      return;
    }
    stepper.next();
  }

  openReceipt(){
    const stdInfo = {
      ...this.enquiryForm.value,
      father: {firstName: this.enquiryForm.value.guardian }
    }
    this.dialog.open(InvoiceReceiptComponent,{
      data: {
        stdInfo,
        receiptList: [{
          paymentName: this.enquiryPaymentForm.value.feeName,
          amount: this.enquiryPaymentForm.value.amount
        }]
      }
    })
  }

  // downloadReceipt(): void {
  //   html2canvas(this.receipt.nativeElement).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 192;
  //     var imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     const contentDataURL = canvas.toDataURL("image/png");
  //     let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
  //     pdf.addImage(contentDataURL, "PNG", 10, 10, imgWidth, imgHeight);
  //     pdf.save(`${this.enquiryForm.value.firstName}_${this.enquiryForm.value.lastName}.pdf`); // Generated PDF
  //   });
  // }

  saveParentInteractionForm(): void {
    this.parentInteractionForm.markAllAsTouched();
    if (this.parentInteractionForm.invalid) {
      return;
    }
    this.enquiryForm.patchValue({
      parentInteraction: JSON.stringify(this.parentInteractionForm.value)
    })
    this.onSubmit(true);
  }

  selectedRating(event: number) {
    this.rating.setValue(event);
  }

  saveRating(): void {
    if (this.rating.value) {
      this.enquiryForm.patchValue({
        rating: this.rating.value
      })
    }
    if(this.review.value) {
      this.enquiryForm.patchValue({
        review: this.review.value
      })
    }
    this.onSubmit();
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
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('download.pdf');
      if(isMobile){
          setTimeout(() => {
            viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1');
            // this.ngxService.stop();
          }, 0);
        }
    });
  }
  // this code for creating PDF ENDS

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
