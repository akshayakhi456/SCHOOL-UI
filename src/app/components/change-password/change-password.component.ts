import { Component } from '@angular/core';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { SharedModule } from '../../shared/shared.module';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { IChangePasswordRequest, IChangePasswordResponse } from '../../shared/models/auth.models';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  regexPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=|\\{}[\]:;'",.<>?/]).{8,}$/;
  oldPasswordShowHide = true;
  newPasswordShowHide = true;
  confirmPasswordShowHide = true;
  changePasswordForm: FormGroup;
  breadcrumbData: IBreadcrumb = {
    title: 'Change Password',
    list: [{
      routerLink: '/changePassword',
      subTitle: 'change-password',
      isRoute: true
    }]
  }

  

  constructor(private breadcrumbService: BreadCrumbService,
    private authenticationService: AuthenticationService,
    private snackbar: SnackbarService,
    private spinnerService: SpinnerService
  ) {
    this.breadcrumbService.setBreadcrumb(true,this.breadcrumbData);
    this.changePasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.pattern(this.regexPattern)]),
      confirmPassword: new FormControl('', Validators.required),
      oldPassword: new FormControl('', Validators.required)
    }, {
      validators: this.matchValidator('newPassword', 'confirmPassword')
    })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.changePasswordForm.controls;
  }

  ngOnInit(): void {
    
  }

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

  changePassword(): void {
    this.spinnerService.show();
    this.authenticationService.changePasswordUser(this.changePasswordForm.value as IChangePasswordRequest).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        const result = res.result as IChangePasswordResponse;
        if(result.result.succeeded){
          this.snackbar.openSuccessSnackbar('Password Change Successfully.');
        }
        else {
          let error = '';
          result.result.errors.forEach(x => {
            error += ' ' + x.description 
          })
          this.snackbar.openDangerSnackbar(error);
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
}
