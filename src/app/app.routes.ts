import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { User } from './user/user';
import { Dashboard } from './dashboard/dashboard';
import { Tasklist } from './tasklist/tasklist';
import { Task } from './task/task';
import { Taskform } from './taskform/taskform';

export const routes: Routes = [
    {path:"login", component: Login},
    {path:"register", component: Register},
    {path:"dashboard", component: Dashboard},
    {path:"users", component: User},
    {path:"tasks", component: Tasklist},
    {path: "task/:id", component: Task},
    {path: "createTask", component: Taskform}
];
