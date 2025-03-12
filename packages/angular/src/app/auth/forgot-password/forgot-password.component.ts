import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PasswordResetScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, PasswordResetScreenComponent],
  template: `
    <fui-password-reset-screen
      [signInRoute]="'/auth/sign-in'"
      (onBackToSignInClick)="navigateTo('/auth/sign-in')"
    ></fui-password-reset-screen>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class ForgotPasswordComponent {
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
