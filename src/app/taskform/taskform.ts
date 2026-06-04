import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserModel } from '../user/usermodel';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'taskform',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './taskform.html',
  styleUrl: './taskform.css',
})
export class Taskform {
  users = signal<UserModel[] | undefined>([]);
  usersLoaded = signal(false);
  httpClient = inject(HttpClient);
  url = 'http://127.0.0.1:5000';
  dropdownOpen = false;
  assignedUsersId = signal<number[]>([]);
  assignedUsers = signal<UserModel[] | undefined>([]);
  creator?: UserModel
  router = inject(Router);

  form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      validators: [Validators.required],
    }),
    priority: new FormControl('', {
      validators: [Validators.required],
    }),
    status: new FormControl('', {
      validators: [Validators.required],
    }),
    assigned_user_ids: new FormControl<number[]>([], {
      validators:[Validators.required]
    })
  });
  onUserSelectClick() {
    if (!this.usersLoaded()) {
      this.httpClient.get(this.url + '/users').subscribe({
        next: (value: any) => {
          setTimeout(() => {
            this.users.set(value.users);
            console.log(this.users());
            this.usersLoaded.set(true);
          }, 1000);
        },
      });
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen && !this.usersLoaded()) {
      this.onUserSelectClick(); // fetch users when opening
    }
  }
  toggleUser(user:UserModel) {
   const index = this.assignedUsersId().indexOf(user.id);
   
   
   let users = this.assignedUsersId()

    if(index === -1) {
      this.assignedUsersId.set([...this.assignedUsersId(), user.id])
    }else {
      users = this.assignedUsersId().filter(u => u !== users[index])
      this.assignedUsersId.set(users)
    }

    let assignedsers = this.users()?.filter(u => {
      console.log(this.assignedUsersId().includes(u.id));
      
      return this.assignedUsersId().includes(u.id)
    })
    console.log(assignedsers);
    this.assignedUsers.set(assignedsers)
    

    this.form.patchValue({
      assigned_user_ids: this.assignedUsersId()
    })
  }
  isChecked(id:number) {
    return this.assignedUsersId().includes(id);
  }
  submit() {
    const user_info = window.localStorage.getItem("user_information")
    let email = '';
    let username = '';
    if (user_info) {
      const user = JSON.parse(user_info);
      email = user.email;
      username = user.username;
    }
    this.creator = this.users()?.filter(u => u.email == email && u.username == username)[0]; 
    this.httpClient.post(this.url + "/task/" + this.creator?.id, this.form.value).subscribe({
      next: () => { 
        this.form.reset()
        this.router.navigate(["/tasks"])
      }
    });

    
  }
}
