import { environment } from '../../environments/environment';

import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  passowrdHasNumbers: boolean = false;
  passowrdHasUppercase: boolean = false;
  passowrdHasLowercase: boolean = false;
  passowrdValidlength: boolean = false;
  passwordValidCharacters: boolean = false;

  emailRegex: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  //debug
  email = '';
  password = '';
  confirmPassword = '';
  errorMessages: string[] = [];

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: [
          this.email,
          [Validators.required, this.validatePattern(this.emailRegex)],
        ],
        password: [
          this.password,
          Validators.compose([
            Validators.required,
            this.validatePattern(this.passwordRegex),
          ]),
        ],
        confirmPassword: [this.confirmPassword, [Validators.required]],
      },
      {
        validator: this.comparePasswords('password', 'confirmPassword'),
      }
    );
  }

  updateBools(): void {
    const passwordStr = this.form.controls['password'].value;
    this.passowrdHasNumbers = /[0-9]/.test(passwordStr);
    this.passowrdHasUppercase = /[A-Z]/.test(passwordStr);
    this.passowrdHasLowercase = /[a-z]/.test(passwordStr);
    this.passowrdValidlength = passwordStr.length >= 6;
    this.passwordValidCharacters = /[@$!%*?&]/.test(passwordStr);
  }

  get registerFormControl() {
    return this.form.controls;
  }

  // getFormValidationErrors() {
  //   if (!this.form?.controls) return null;
  //   return Object.keys(this.form.controls).forEach((key) => {
  //     // @ts-ignore:next-line
  //     const controlErrors: ValidationErrors | null = this.form.get(key).errors;
  //     if (controlErrors != null) {
  //       Object.keys(controlErrors).forEach((keyError) => {
  //         console.log(
  //           'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
  //           controlErrors[keyError]
  //         );
  //       });
  //     }
  //   });
  // }

  validatePattern(regExp: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const validMatch = regExp.test(control.value);
      return validMatch ? null : { regexError: { value: control.value } };
    };
  }

  comparePasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return null;
      } else {
        confirmPasswordControl.setErrors(null);
        return true;
      }
    };
  }

  submit(): void {
    this.submitted = true;
    if (!this.form.valid) {
      console.warn('bad form!');
      return;
    }
    console.warn('good form!', environment);

    console.log(this.form.getRawValue());
    const {
      email: Email,
      password: Password,
      confirmPassword: ConfirmPassword,
    } = this.form.getRawValue();

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const payload = {
      Email,
      Password,
      ConfirmPassword,
    };
    const body = JSON.stringify(payload);

    this.httpClient
      .post(`${environment.apiUrl}/api/account/register`, body, { headers })
      .subscribe(
        (res) => {
          this.router.navigate(['/login']);
        },
        (errRes) => {
          const [errorState]: any = Object.entries(errRes?.error.ModelState);
          const messages: string[] = errorState[1];
          this.errorMessages = messages;
          console.log(
            '🚀 ~ file: register.component.ts ~ line 163 ~ RegisterComponent ~ .subscribe ~ error',
            { messages }
          );
        }
      );
  }
}
