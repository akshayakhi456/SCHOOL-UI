import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaymentsService } from '../../shared/services/payments/payments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from '../../shared/services/settings/settings.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  paymentModeList: Array<string> = ['Cash','Card','Cheque','Online'];
  stdInfo;
  PaymentsFeeList: any = [];
  actualFeeAmount = null;
  paymentForm = new FormGroup({
    paymentName: new FormControl<string>('',Validators.required),
    paymentType: new FormControl<string>('',Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    remarks: new FormControl<string>('',Validators.required),
    dateOfPayment: new FormControl<Date>(new Date()),
    studentId: new FormControl<number>(0),
    acedamicYearId: new FormControl<number>(1)
  })

  constructor(private service: PaymentsService,
    public dialogRef: MatDialogRef<PaymentsComponent>,
    private settingService: SettingsService,
    private spinnerService: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar) {
      this.stdInfo = data.sudentInfo
  }

  get f(): {[key: string]: AbstractControl} {
    return this.paymentForm.controls;
  }

  ngOnInit() {
    this.paymentForm.patchValue({studentId: this.stdInfo.id});
    this.getPaymentAllotment();
    this.paymentForm.controls.paymentName.valueChanges.subscribe(res => {
      const row = this.PaymentsFeeList.find((x: any)=>x.paymentName == res);
      this.actualFeeAmount = row.amount;
      this.paymentForm.controls.amount.addValidators(this.customValidatorFn);
      this.paymentForm.controls.amount.updateValueAndValidity();
    })
  }

  customValidatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid: boolean = this.actualFeeAmount! <= control.value;
      return valid ? null : {amountMinError: true};
    };
  }

  savePayments(): void {
    this.paymentForm.markAllAsTouched();
    if(this.paymentForm.invalid){
      return;
    }
    this.spinnerService.show();
    this.service.create(this.paymentForm.value).subscribe({next: res => {
      this.spinnerService.dispose();
      this.snackbar.open("Saved Successfully.", "Close", {duration: 2000})
    },
    error: () => {
      this.spinnerService.dispose();
    }
  })

  }

  getPaymentAllotment(){
    this.spinnerService.show();
    this.settingService.getPaymentAllotment(this.stdInfo.className).subscribe(res => {
      this.spinnerService.dispose();
      this.PaymentsFeeList = res.result ?? res
    },()=>{
      this.spinnerService.dispose();
    })
  }
  
}
