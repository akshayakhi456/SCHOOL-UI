import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnquiryService } from '../../shared/services/enquiry/enquiry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewPrintReceiptComponent } from '../../shared/components/view-print-receipt/view-print-receipt.component';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-create-enquiry',
  standalone: true,
  imports: [SharedModule, NgxMaskDirective, NgxMaskPipe, ViewPrintReceiptComponent, StarRatingComponent],
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
  questionList = [
    {
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
    reference: new FormControl<string>(''),
    address: new FormControl<string>(''),
    status: new FormControl<boolean>(true),
    previousSchoolName: new FormControl<string>(''),
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
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'] ? 
    this.activatedRoute.snapshot.params['id'] : 0;
    if (this.id) {
      this.parentInteractionFormControls()
      this.getEnquireFormById();
    }    
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
    this.service.getById(this.id).subscribe({
      next: res => {
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
          if (res.result.enquiry.rating ?? res.enquiry.rating) {
            this.rating.setValue(res.result.enquiry.rating ?? res.enquiry.rating)
          }
          if (res.result.enquiry.review ?? res.enquiry.review) {
            this.review.setValue(res.result.enquiry.review ?? res.enquiry.review)
          }
        }
      }
    })
  }

  onSubmit() {
    const entranceExam = this.registrationForm.value;
    let payload = {
      enquiry: this.enquiryForm.value,
      enquiryEntranceExam: {
        id: entranceExam.id,
        dateOfExam: entranceExam.dateOfExam,
        modeOfExam: entranceExam.modeOfExam,
        scheduleTimeForExam: `${entranceExam.hours}:${entranceExam.mins}`,
        enquiryStudentId: `${entranceExam.enquiryStudentId}`
      }
    }
    if (this.id == 0) {
      this.service.create(payload).subscribe((res: any) => {
        if (res && res.result && res.result.id) {
          this.id = res.result.id;
          this.router.navigate(['enquiry', this.id])
          this.snackbar.open("Created Successfully", "Close", { duration: 2000 })
        }
      })
    }
    else {
      this.service.update(payload).subscribe((res) => {
        if (res) {
          this.snackbar.open("Updated Successfully", "Close", { duration: 2000 })
        }
      })
    }
  }

  savePayments(): void {
    this.enquiryPaymentForm.markAllAsTouched();
    if (this.enquiryPaymentForm.invalid){
      return;
    }
    this.service.createPayment(this.enquiryPaymentForm.value).subscribe({
      next: res => {
        this.generateReceiptBtn = true;
        this.snackbar.open("Saved Successfully.", "Close", { duration: 2000 })
      },
      error: () => { }
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
    this.isOpenReceipt = true;
  }

  downloadReceipt(): void {
    html2canvas(this.receipt.nativeElement).then(canvas => {
      // Few necessary setting options
      var imgWidth = 192;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      pdf.addImage(contentDataURL, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${this.enquiryForm.value.firstName}_${this.enquiryForm.value.lastName}.pdf`); // Generated PDF
    });
  }

  saveParentInteractionForm(): void {
    this.parentInteractionForm.markAllAsTouched();
    if (this.parentInteractionForm.invalid) {
      return;
    }
    this.enquiryForm.patchValue({
      parentInteraction: JSON.stringify(this.parentInteractionForm.value)
    })
    this.onSubmit();
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
}
