import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  url = "http://127.0.0.1:5000";


  register(form:any, route:string) {
    return this.postRequest(route, {
        email: form.controls.email.value,
        username: form.controls.username.value,
        name: form.controls.name.value,
        country: form.controls.country.value,
        role: form.controls.role.value,
        password: form.controls.passwords.controls.password.value
      })
  }
  login(formData:NgForm, route:string) {
    const enteredEmail = formData.form.value.email;
    const enteredUsername = formData.form.value.username;
    const enteredPassword = formData.form.value.password;

    return this.postRequest(route,{
      email: enteredEmail,
      username: enteredUsername,
      password: enteredPassword
    })
  }
  postRequest(route:string, obj: any) {
    return this.httpClient.post(this.url+route,obj)
  }
}
