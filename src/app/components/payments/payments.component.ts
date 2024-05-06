import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PaymentsService } from '../../shared/services/payments/payments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from '../../shared/services/settings/settings.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { StudentService } from '../../shared/services/student/student.service';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ACADEMIC_YEAR } from '../../shared/models/payment.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  paymentModeList: Array<string> = ['Cash','Card','Cheque','Online'];
  stdInfo: any;
  PaymentsFeeList: any = [];
  actualFeeAmount = 0;
  paidAmountList: any;
  paidFeeAmount = 0;
  academicYearList = ACADEMIC_YEAR;
  id = 0;
  paymentForm = new FormGroup({
    paymentName: new FormControl<string>('',Validators.required),
    paymentType: new FormControl<string>('',Validators.required),
    amount: new FormControl<number | null>(null, [Validators.required, this.customValidatorFn()]),
    remarks: new FormControl<string>('',Validators.required),
    dateOfPayment: new FormControl<Date>(new Date()),
    studentId: new FormControl<number>(0),
    acedamicYearId: new FormControl<number>(1),
    dueDateOfPayment: new FormControl<Date | null>(null),
    PaymentAllotmentId: new FormControl<number | null>(null)
  });

  cardDetails = new FormGroup({
    cardNumber: new FormControl<number | null>(null),
    expirationDate: new FormControl<string>(''),
    cvv: new FormControl<number | null>(null),
    cardHolderName: new FormControl<string> ('')
  });

  chequeDetails = new FormGroup({
    bankName: new FormControl<string>(''),
    chequeNo: new FormControl<string>(''),
    branch: new FormControl<string> ('')
  });
  breadcrumbData: IBreadcrumb = {
    title: 'Payments',
    list: [{
      routerLink: '/accounts',
      subTitle: 'Accounts',
      isRoute: true
  },{
    routerLink: '/Paymemts',
    subTitle: 'Payment',
    isRoute: true
}]
}

  constructor(private service: PaymentsService,
    private settingService: SettingsService,
    private spinnerService: SpinnerService,
    private breadcrumbService: BreadCrumbService,
    private activatedRoute: ActivatedRoute,
    private studentService: StudentService,
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackbarService: SnackbarService) {
    this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
    this.french();
  }

  get f(): {[key: string]: AbstractControl} {
    return this.paymentForm.controls;
  }

  get cheque(): {[key: string]: AbstractControl} {
    return this.chequeDetails.controls;
  }

  get card(): {[key: string]: AbstractControl} {
    return this.cardDetails.controls;
  }

  get balanceFeeAmount(): number {
    return Number(this.actualFeeAmount) - Number(this.paidFeeAmount)
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id){
      this.getStudentById();
      this.paymentForm.patchValue({studentId: this.id});
    }
    this.paymentForm.controls.paymentName.valueChanges.subscribe(res => {
      const row = this.PaymentsFeeList.find((x: any)=>x.paymentName == res);
      if (this.paidAmountList) {
        const paidList = this.paidAmountList.filter((x: any) => x.paymentName == res);
        if (paidList?.length) {
          this.paidFeeAmount = paidList.map((item: any) => item.amount).reduce((p: number, c: number) => p + c)
        }
      };
      this.paymentForm.patchValue({PaymentAllotmentId: Number(row.id)})
      this.actualFeeAmount = Number(row.amount);
    });

    this.paymentForm.controls.paymentType.valueChanges.subscribe(res => {
      this.setValidationOfCardCheque(res ?? '');
    });
  }

  french() {
    this._locale = 'en';
    this._adapter.setLocale(this._locale);
    this.updateCloseButtonLabel('Fermer le calendrier');
  }

  updateCloseButtonLabel(label: string) {
    this._intl.closeCalendarLabel = label;
    this._intl.changes.next();
  }

  setValidationOfCardCheque(paymentType: string): void {
    if (paymentType == 'Card') {
      this.cardDetails.controls.cardHolderName.setValidators(Validators.required);
      this.cardDetails.controls.cardHolderName.updateValueAndValidity();
      this.cardDetails.controls.cardNumber.setValidators(Validators.required);
      this.cardDetails.controls.cardNumber.updateValueAndValidity();
      this.cardDetails.controls.cvv.setValidators(Validators.required);
      this.cardDetails.controls.cvv.updateValueAndValidity();
      this.cardDetails.controls.expirationDate.setValidators(Validators.required);
      this.cardDetails.controls.expirationDate.updateValueAndValidity();
      this.chequeDetails.controls.bankName.removeValidators(Validators.required);
      this.chequeDetails.controls.bankName.updateValueAndValidity();
      this.chequeDetails.controls.branch.removeValidators(Validators.required);
      this.chequeDetails.controls.branch.updateValueAndValidity();
      this.chequeDetails.controls.chequeNo.removeValidators(Validators.required);
      this.chequeDetails.controls.chequeNo.updateValueAndValidity();
    }
    else if (paymentType == 'Cheque') {
      this.cardDetails.controls.cardHolderName.removeValidators(Validators.required);
      this.cardDetails.controls.cardHolderName.updateValueAndValidity();
      this.cardDetails.controls.cardNumber.removeValidators(Validators.required);
      this.cardDetails.controls.cardNumber.updateValueAndValidity();
      this.cardDetails.controls.cvv.removeValidators(Validators.required);
      this.cardDetails.controls.cvv.updateValueAndValidity();
      this.cardDetails.controls.expirationDate.removeValidators(Validators.required);
      this.cardDetails.controls.expirationDate.updateValueAndValidity();
      this.chequeDetails.controls.bankName.setValidators(Validators.required);
      this.chequeDetails.controls.bankName.updateValueAndValidity();
      this.chequeDetails.controls.branch.setValidators(Validators.required);
      this.chequeDetails.controls.branch.updateValueAndValidity();
      this.chequeDetails.controls.chequeNo.setValidators(Validators.required);
      this.chequeDetails.controls.chequeNo.updateValueAndValidity();
    }
    else {
      this.cardDetails.controls.cardHolderName.removeValidators(Validators.required);
      this.cardDetails.controls.cardHolderName.updateValueAndValidity();
      this.cardDetails.controls.cardNumber.removeValidators(Validators.required);
      this.cardDetails.controls.cardNumber.updateValueAndValidity();
      this.cardDetails.controls.cvv.removeValidators(Validators.required);
      this.cardDetails.controls.cvv.updateValueAndValidity();
      this.cardDetails.controls.expirationDate.removeValidators(Validators.required);
      this.cardDetails.controls.expirationDate.updateValueAndValidity();
      this.chequeDetails.controls.bankName.removeValidators(Validators.required);
      this.chequeDetails.controls.bankName.updateValueAndValidity();
      this.chequeDetails.controls.branch.removeValidators(Validators.required);
      this.chequeDetails.controls.branch.updateValueAndValidity();
      this.chequeDetails.controls.chequeNo.removeValidators(Validators.required);
      this.chequeDetails.controls.chequeNo.updateValueAndValidity();
    }
  }

  getStudentById(): void {
    this.spinnerService.show();
    this.studentService.getById(this.id).subscribe({
      next: res => {
        this.spinnerService.dispose();
        this.stdInfo = res.result ?? res;
        this.getReceiptList();
        this.getPaymentAllotment();
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  customValidatorFn(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const valid: boolean = Number(this.balanceFeeAmount!) >= control.value;
      return valid ? null : {amountMinError: true};
    };
  }

  getReceiptList(): void{
    this.spinnerService.show();
    this.service.getReceiptById(this.stdInfo.students.id).subscribe({next: res => {
    this.spinnerService.dispose();
      this.paidAmountList = res;
    },
    error: () =>{
    this.spinnerService.dispose();
    }
  })
  }

  savePayments(): void {
    this.paymentForm.markAllAsTouched();
    if(this.paymentForm.invalid || this.cardDetails.invalid || this.chequeDetails.invalid){
      return;
    }
    this.spinnerService.show();
    this.service.create(this.paymentForm.value).subscribe({next: res => {
      this.spinnerService.dispose();
      this.snackbarService.openSuccessSnackbar("Saved Successfully.")
    },
    error: () => {
      this.spinnerService.dispose();
    }
  })

  }

  getPaymentAllotment(){
    this.spinnerService.show();
    this.settingService.getPaymentAllotment(this.stdInfo.students.className).subscribe(res => {
      this.spinnerService.dispose();
      this.PaymentsFeeList = res.result ?? res
    },()=>{
      this.spinnerService.dispose();
    })
  }
  
}
