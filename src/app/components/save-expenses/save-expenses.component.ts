import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from '../../shared/services/expenses/expenses.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    amount: new FormControl<number>(0, Validators.required),
    remarks: new FormControl<string>('', Validators.required)
  })

  constructor(private service: ExpensesService,
    private snackbar: MatSnackBar) {}

  saveExpenses(): void {
    this.service.create(this.expensesForm.value).subscribe({
      next: res => {
        // if (res) {
          this.snackbar.open("Created Successfully.", "Close", {duration: 2000});
        // }
      }
    })
  }
}
