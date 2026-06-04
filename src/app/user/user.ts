import { catchError, debounceTime, throwError } from 'rxjs';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserModel } from './usermodel';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user';

@Component({
  selector: 'user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  userService = inject(UserService);
  users = this.userService.loadedUsers;
  selectedUsers = this.userService.loadedSelectedUsers;
  isFetching = signal(false);
  error = signal("");

  destroyRef = inject(DestroyRef);

 

  ngOnInit(): void {
      this.isFetching.set(true)
      const subscription = this.userService.loadAllUsers(
      ).subscribe({
        error: (error:Error) => {
          this.isFetching.set(false)
          this.error.set(error.message)
        },
        complete: () => {this.isFetching.set(false)}
      })
      this.destroyRef.onDestroy(() => {subscription.unsubscribe()})
  }
  addUser(user:UserModel) {
    const selectedUser = {
      country: user.country,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role, 
      selectedUser: true,
    }
    
    this.userService.UpdateUser(user.id, selectedUser).subscribe()
   
  }
  removeFromSelectedList(user: UserModel) {
      const selectedUser = {
      country: user.country,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role, 
      selectedUser: false,
    }
    
    this.userService.UpdateUser(user.id, selectedUser).subscribe()
  
  }
}
