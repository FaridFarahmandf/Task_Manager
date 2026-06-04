import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ɵEmptyOutletComponent, RouterLinkWithHref, Router } from "@angular/router";
import { debounceTime } from 'rxjs';
import { UserService } from '../services/user';

@Component({
  selector: 'login',
  imports: [ɵEmptyOutletComponent, RouterLinkWithHref, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private userService = inject(UserService);

  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef)

  constructor() {

    afterNextRender(() => {
      const user_data = window.localStorage.getItem("user_information")
      if(user_data) {
        const pars_user_data = JSON.parse(user_data)
        const entered_username = pars_user_data["username"]
        const entered_email = pars_user_data["email"]
        setTimeout(() => {
          this.form().controls["username"].setValue(entered_username)
          this.form().controls["email"].setValue(entered_email)
        }, 1);
      }
      let subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (val) => localStorage.setItem(
          "user_information",
          JSON.stringify({email: val.email, username: val.username})
        )
      })
      this.destroyRef.onDestroy(() => subscription?.unsubscribe())
    })
  }

  login(formData:NgForm) {
    
    this.userService.login(formData, "/login").subscribe({
      next: (val:any) => {
        console.log(val);
        window.localStorage.setItem("access_token", val.access_token)
        window.localStorage.setItem("refresh_token", val.refresh_token)
        this.router.navigate(["tasks"])
        this.form().reset();
      }
    })
    
  }
}
