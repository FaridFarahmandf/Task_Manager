import { UserModel } from './../user/usermodel';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  url = "http://127.0.0.1:5000";
  users =  signal<UserModel[] | undefined>([]);
  selectedUsers = signal<UserModel[] | undefined>([])
  loadedUsers = this.users.asReadonly();
  loadedSelectedUsers = this.selectedUsers.asReadonly();

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
  UpdateUser(user_id:number,user_data:any) {

    return this.httpClient.put(this.url + "/user/" + user_id, user_data).pipe(
      catchError((error) => {
        return throwError(() => new Error("Failed to add user"))
      }
      ),
      tap({
        next: (value:any) => {
          this.selectedUsers.set(value.selectedUsers) 
        }
      })
    )
    
  }
  postRequest(route:string, obj: any) {
    return this.httpClient.post(this.url+route,obj)
  }

  loadAllUsers() {
    return this.getData("/users").pipe(tap({
        next: (value:any) => {
          this.users.set(value.users)
          
          this.selectedUsers.set(value.selectedUsers)
  
          
        }
      }))
  }
  getData(route:string) {
    return this.httpClient.get(this.url+route).pipe(
            catchError((err, obs) => {
              console.log(err);
              return throwError(() => new Error("Something wrong is happened") )
            })
      )
  }
}
