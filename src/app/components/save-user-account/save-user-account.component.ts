import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';
import { IRegisterRequest } from '../../shared/models/auth.models';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './save-user-account.component.html',
  styleUrl: './save-user-account.component.scss'
})
export class SaveUserAccountComponent {
  registerForm = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    userName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    role: new FormControl<string>('', Validators.required),
  });
  roles: Array<string> = [];

  constructor(private authService: AuthenticationService,
    private dialogRef: MatDialogRef<SaveUserAccountComponent>,
    private snackbarservice: SnackbarService,
    private spinnerService: SpinnerService
  ) {}

  get registerFormControls(): {[key: string]: AbstractControl} {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.spinnerService.show();
    this.authService.getRoles().subscribe({
      next: (res: any) => {
        this.spinnerService.dispose();
        this.roles = res.result;
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  userCreate() {
    this.registerForm.markAllAsTouched();
    if(this.registerForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.authService.registerUser(this.registerForm.value as IRegisterRequest).subscribe({
      next: (res) =>{
        this.spinnerService.dispose();
        this.snackbarservice.openSuccessSnackbar(res.message);
        this.dialogRef.close();
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
}
