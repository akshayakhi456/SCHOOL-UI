import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  regexPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=|\\{}[\]:;'",.<>?/]).{8,}$/;
  newPasswordShowHide = true;
  confirmPasswordShowHide = true;
  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.regexPattern)]),
    confirmPassword: new FormControl('', Validators.required),
  }, {
    validators: this.matchValidator('newPassword', 'confirmPassword')
  })

  get f(): {[key: string]: AbstractControl} {
    return this.changePasswordForm.controls;
  }

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private spinnerService: SpinnerService
  ) {}

  matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
        const control = abstractControl.get(controlName);
        const matchingControl = abstractControl.get(matchingControlName);

        if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
            return null;
        }

        if (control!.value !== matchingControl!.value) {
          const error = { confirmedValidator: 'Passwords do not match.' };
          matchingControl!.setErrors(error);
          return error;
        } else {
          matchingControl!.setErrors(null);
          return null;
        }
    }
  }

  resetPassword(): void {
    this.changePasswordForm.markAllAsTouched();
    const password = this.changePasswordForm.value.newPassword;
    if(this.changePasswordForm.invalid){
      return;
    }
    const token = this.activatedRoute.snapshot.queryParams['token'];
    const userName = this.activatedRoute.snapshot.queryParams['username'];
    if(!token || !userName){
      this.snackbar.openWarningSnackbar("Invalid Session");
      return
    }

    this.spinnerService.show();
    this.authenticationService.resetPasswordWithToken(token.trim().replaceAll(' ','+'), userName, password!).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if(res!.statusCode){
        const result = res.result!;
          this.snackbar.openSuccessSnackbar(result);
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

}
