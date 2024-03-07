import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit{
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

  constructor(private router: Router){}

  ngOnInit() {

  }

  login() {
    this.router.navigate(['/dashboard']);
  }
}
