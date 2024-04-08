import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit{
  loginForm = new FormGroup({
    userName: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  })

  get f(): {[key: string]: AbstractControl} {
    return this.loginForm.controls;
  }

  constructor(private router: Router,
    private spinnerService: SpinnerService,
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
}
