import { catchError, debounceTime, throwError } from 'rxjs';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserModel } from './usermodel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  users = signal<UserModel[] | undefined>([]);
  isFetching = signal(false);
  error = signal("");

  destroyRef = inject(DestroyRef);

  httpClient = inject(HttpClient);
  url = "http://127.0.0.1:5000";


  ngOnInit(): void {
      this.isFetching.set(true)
    
      const subscription = this.httpClient.get(this.url+"/users").pipe(
        catchError((err, obs) => {
          console.log(err);
          return throwError(() => new Error("Something wrong is happened") )
        })
      ).subscribe({
        next: (responseValue:any) => {
            this.users.set(responseValue)
            console.log(this.users());

        },
        error: (error:Error) => {
          
          this.isFetching.set(false)
          this.error.set(error.message)
          
        },
        complete: () => {this.isFetching.set(false)}
      })
      this.destroyRef.onDestroy(() => {subscription.unsubscribe()})
  }
}
