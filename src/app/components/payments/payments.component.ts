import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentsService } from '../../shared/services/payments/payments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  paymentForm = new FormGroup({
    feeName: new FormControl<string>(''),
    paymentType: new FormControl<string>(''),
    amount: new FormControl<number | null>(null),
    remarks: new FormControl<string>(''),
    dateOfPayment: new FormControl<Date>(new Date()),
    studentId: new FormControl<number>(0)
  })

  constructor(private service: PaymentsService,
    public dialogRef: MatDialogRef<PaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar) {
      this.stdInfo = data.sudentInfo
  }

  ngOnInit() {
    this.paymentForm.patchValue({studentId: this.stdInfo.id});
  }

  savePayments(): void {
    this.service.create(this.paymentForm.value).subscribe({next: res => {
      this.snackbar.open("Saved Successfully.", "Close", {duration: 2000})
    },
    error: () => {}
  })

  }
  
}
