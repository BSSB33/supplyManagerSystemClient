import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService, httpOptions } from '../services/auth.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { User } from '../classes/user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [LoginFormComponent]
})
export class LoginFormComponent implements OnInit {

  message: string;
  hidePassword = true;

  form = this.fb.group({
    username: ['', [ Validators.required ]],
    password: ['', [ Validators.required ]],
  });

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      this.message = null;
      await this.authService.login(this.username.value, this.password.value);
      if (this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
      } else {
        this.router.navigate(['/']);
      }
    } catch (e) {
      //TODO doesn't work
      this.message = 'Cannot log in!';
    }
  }
}