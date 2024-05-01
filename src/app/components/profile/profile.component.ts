import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IRegisterRequest } from '../../shared/models/auth.models';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { SaveUserAccountComponent } from '../save-user-account/save-user-account.component';
import { HTTP_CODES } from '../../shared/constants/common.constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  registerForm = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    userName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
  });
  roles: Array<string> = [];

  constructor(private authService: AuthenticationService,
    private snackbarservice: SnackbarService,
    private spinnerService: SpinnerService
  ) {}

  get registerFormControls(): {[key: string]: AbstractControl} {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.getMeAPI();
  }

  getMeAPI() {
    this.spinnerService.show();
    this.authService.me().subscribe({
      next: (res) =>{
        this.spinnerService.dispose();
        if(res.statusCode == HTTP_CODES.SUCCESS) {
          this.registerForm.patchValue(res.result!)
        }
      },
      error:() =>{
        this.spinnerService.dispose();
      }
    })
  }

  updateUser() {
    this.registerForm.markAllAsTouched();
    if(this.registerForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.authService.updateUser(this.registerForm.value as IRegisterRequest).subscribe({
      next: (res) =>{
        this.spinnerService.dispose();
        this.snackbarservice.openSuccessSnackbar(res.result!);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
}
