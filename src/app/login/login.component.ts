import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  email = 'dotnetAdmin6@test.com';
  password = 'Aa123456!';
  errorMessages: string[] = [];
  isLoginFailure: boolean = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [this.email, [Validators.required]],
      password: [this.password, [Validators.required]],
    });
  }

  get registerFormControl() {
    return this.form.controls;
  }

  submit(): void {
    this.isLoginFailure = false;
    this.submitted = true;
    this.isLoading = true;
    if (!this.form.valid) {
      console.warn('bad form!');
      return;
    }
    console.warn('good form!', environment);

    console.log(this.form.getRawValue());
    const { email: Email, password: Password } = this.form.getRawValue();

    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', Email)
      .set('password', Password);
    console.log(
      '🚀 ~ file: login.component.ts ~ line 49 ~ LoginComponent ~ submit ~ body',
      body
    );

    let options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };

    this.httpClient
      .post(`${environment.apiUrl}/token`, body.toString(), options)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.authService.logIn(res.access_token);
        },
        (errRes) => {
          this.isLoginFailure = true;
          this.isLoading = false;
        }
      );
  }
}
