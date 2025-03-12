import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SignInAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, SignInAuthScreenComponent],
  template: `
    <fui-sign-in-auth-screen
      [forgotPasswordRoute]="'/auth/forgot-password'"
      [registerRoute]="'/auth/register'"
      (onForgotPasswordClick)="navigateTo('/auth/forgot-password')"
      (onRegisterClick)="navigateTo('/auth/register')"
    >
      <div>
        <a routerLink="/auth/email-link" class="text-blue-500 hover:underline">Sign in with email link</a>
      </div>
      <div>
        <a routerLink="/auth/phone" class="text-blue-500 hover:underline">Sign in with phone number</a>
      </div>
    </fui-sign-in-auth-screen>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      
      .text-blue-500 {
        color: #3b82f6;
      }
      
      .hover\:underline:hover {
        text-decoration: underline;
      }
      }

      .back-link {
        margin-top: 1.5rem;
        text-align: center;
      }

      a {
        color: #3b82f6;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class SignInComponent {
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
