import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SignUpAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, SignUpAuthScreenComponent],
  template: `
    <fui-sign-up-auth-screen
      [signInRoute]="'/auth/sign-in'"
      (onBackToSignInClick)="navigateTo('/auth/sign-in')"
    ></fui-sign-up-auth-screen>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class RegisterComponent {
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
