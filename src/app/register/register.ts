import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime} from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user';

const user_data = window.localStorage.getItem('user_information');
let initial_value = {
  email: '',
  username: '',
  name: '',
  country: '',
  role: '',
};
let enteredEmail = '';
let enteredUsername = '';
let enteredName = '';
let enteredRole = '';
let enteredCountry = '';

if (user_data) {
  initial_value = JSON.parse(user_data);
  console.log(initial_value);

  enteredEmail = initial_value.email;
  enteredUsername = initial_value.username;
  enteredName = initial_value.name;
  enteredRole = initial_value.role;
  enteredCountry = initial_value.country;
}

function containQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}

function euqalValues(control1:string,control2:string) {
  return (control: AbstractControl) => {
    const val1 = control.get(control1)?.value;
    const val2 = control.get(control2)?.value;
  
    if(val1 === val2) {
      return null;
    }
    return {euqalValues : true}
  }
}

@Component({
  selector: 'register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private router = inject(Router)
  private userSerivce = inject(UserService);

  destroyDef = inject(DestroyRef);
  roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'employee' },
  ];

  form = new FormGroup({
    email: new FormControl(enteredEmail, {
      validators: [Validators.required, Validators.email],
    }),
    username: new FormControl(enteredUsername, {
      validators: [Validators.required],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), containQuestionMark],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    }, {
      validators: [euqalValues("password", "confirmPassword")]
    }),
    name: new FormControl(enteredName, {
      validators: [Validators.required],
    }),
    country: new FormControl(enteredCountry, {
      validators: [Validators.required],
    }),
    role: new FormControl(enteredRole, {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          'user_information',
          JSON.stringify({
            email: value.email,
            username: value.username,
            name: value.name,
            country: value.country,
            role: value.role,
          }),
        );
      },
    });

    this.destroyDef.onDestroy(() => subscription.unsubscribe());
  }

  findTheRole(enteredRole: any) {
    for (let i = 0; i < this.roles.length; i++) {
      if (enteredRole == this.roles[i].id) {
        return this.roles[i].name;
      }
    }
    return null;
  }

  get getEmailError() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }
  get getUsernameError() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.invalid
    );
  }
  get getPasswordError() {
    return this.form.controls.passwords.controls.password.touched && this.form.controls.passwords.controls.password.invalid;
  }
  get getConfirmPasswordError() {
    return this.form.controls.passwords.controls.confirmPassword.touched && this.form.controls.passwords.controls.confirmPassword.invalid;
  }
  get questionMarkError() {
    return containQuestionMark(this.form.controls.passwords.controls.password);
  }
  get getNameError() {
    return this.form.controls.name.touched && this.form.controls.name.invalid;
  }
  get getCountryError() {
    return this.form.controls.country.touched && this.form.controls.country.invalid;
  }
  get getRoleError() {
    return this.form.controls.role.touched && this.form.controls.role.invalid;
  }
  onSubmit() {
    console.log({
      email: this.form.controls.email.value,
      username: this.form.controls.username.value,
      name: this.form.controls.name.value,
      country: this.form.controls.country.value,
      role: this.form.controls.role.value,
      password: this.form.controls.passwords.value
    })
    this.userSerivce.register(this.form, "/register").subscribe({
      next: () => {
        this.form.reset({
          email: "",
          username: "",
          name: "",
          country: "",
          role: "",
          passwords :{
            password: "",
            confirmPassword: ""
          }
        })
        this.router.navigate(["/dashboard"])
      }
    })
  }
}
