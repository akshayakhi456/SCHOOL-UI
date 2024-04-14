import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
constructor (@Inject(MAT_SNACK_BAR_DATA) public data: any, private snackbar: MatSnackBarRef<SnackbarComponent>) {}

closeSnackbar() {
  this.snackbar.dismiss();
}
}
