import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit{
  loginPage = true;
  loginForm = new FormGroup({
    userName: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  })

  userName = new FormControl('', Validators.required);

  get f(): {[key: string]: AbstractControl} {
    return this.loginForm.controls;
  }

  constructor(private router: Router,
    private spinnerService: SpinnerService,
    private snackbar: SnackbarService,
    private authService: AuthenticationService){}

  ngOnInit() {

  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: res => {
        this.spinnerService.dispose();
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  resetPassword() {
    this.userName.markAsTouched();
    if(!this.userName.value){
      return;
    }
    this.spinnerService.show();
    this.authService.resetPassword(this.userName.value).subscribe({
      next: res => {
        this.spinnerService.dispose();
        this.snackbar.openSuccessSnackbar(res.result!);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

}
