import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [LoginFormComponent]
})
export class LoginFormComponent implements OnInit {

  message: string;
  hidePassword = true;
  loaded: boolean = false;

  form = this.fb.group({
    username: ['', [ Validators.required ]],
    password: ['', [ Validators.required ]],
  });

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingService: LoadingService,
  ) { 
    if(this.router.url.substring(this.router.url.lastIndexOf('/') + 1) == "login"){
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    if(localStorage.getItem('loginMessage') != null){
      this.message = localStorage.getItem('loginMessage');
      localStorage.removeItem('loginMessage');
    }
  }

  async onSubmit() {
    this.loadingService.setLoading(true);

    this.message = null;
    const respone = await this.authService.login(this.username.value, this.password.value);
    try {
      JSON.parse(JSON.stringify(respone));
      this.message = 'Logged in!';
      this.loadingService.setLoading(false);
      if (this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);
      } else {
        this.router.navigate(['/']);
        localStorage.removeItem('loginMessage');
      }
    } catch (error) {
      this.message = 'Cannot log in!';
      this.loadingService.setLoading(false);
      return;
    }

  }
 
}
