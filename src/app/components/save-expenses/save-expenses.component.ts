import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from '../../shared/services/expenses/expenses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save-expenses',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './save-expenses.component.html',
  styleUrl: './save-expenses.component.scss'
})
export class SaveExpensesComponent {
  miscellanousList = ['Fuel', 'Courier', 'Stationery', 'Events'];

  expensesForm = new FormGroup({
    id: new FormControl<number>(0),
    miscellanous: new FormControl<string>('', Validators.required),
    doe: new FormControl<string>('', Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    remarks: new FormControl<string>('', Validators.required)
  })

  get f(): {[key: string]: AbstractControl} {
    return this.expensesForm.controls;
  }

  constructor(private service: ExpensesService,
    public dialogRef: MatDialogRef<SaveExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar) {}

  saveExpenses(): void {
    this.expensesForm.markAllAsTouched();
    if (this.expensesForm.invalid) {
      return;
    }
    this.service.create(this.expensesForm.value).subscribe({
      next: res => {
        // if (res) {
          this.snackbar.open("Created Successfully.", "Close", {duration: 2000});
          this.data.Close();
        // }
      }
    })
  }
}
