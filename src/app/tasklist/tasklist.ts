import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { TaskModel } from './task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'tasklist',
  imports: [],
  templateUrl: './tasklist.html',
  styleUrl: './tasklist.css',
})
export class Tasklist implements OnInit {
  tasks = signal<TaskModel[]>([])

  url = "http://127.0.0.1:5000";
  route = inject(Router)
  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
      const subscription = this.httpClient.get(this.url+"/task").subscribe({
        next: (value:any) => {
          this.tasks.set(value)
          console.log(this.tasks());
          
        }
      })

      this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
  goToTask(id:number) {
    this.route.navigate(["/task/"+id])
  }
  createTask() {
    this.route.navigate(["/createTask"])
  }
}
