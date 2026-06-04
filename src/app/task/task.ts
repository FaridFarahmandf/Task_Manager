import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskModel } from '../tasklist/task.model';

@Component({
  selector: 'task',
  imports: [],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task implements OnInit{

  task_data = signal<TaskModel>({
    id:0,
    description: "",
    priority: "",
    status: "",
    title: "",
    assigned_users: [
      {
      country: "",
      email: "",
      id: 1,
      name: "",
      role: "",
      selectedUser: true,
      username: "",
      }
    ],
    creator: {
      country: "",
      email: "",
      name: "",
      id: 1,
      username: "",
      role: "",
      selectedUser: true,
    }
  })

  url = "http://127.0.0.1:5000"
  router = inject(Router)
  private route = inject(ActivatedRoute)
  httpClient = inject(HttpClient)
  destryRef = inject(DestroyRef)

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')

    const subscription = this.httpClient.get(this.url + "/task/" + id).subscribe(
      {
        next: (value:any) => {

          this.task_data.set(value)
          console.log(this.task_data());
          
        }
      }
    );
    this.destryRef.onDestroy(() => subscription.unsubscribe());
  }

  backToList() {
    this.router.navigate(["/tasks"])
  }
}
