import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import {
  SignInAuthScreenComponent,
  GoogleSignInButtonComponent,
} from '@firebase-ui/angular';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SignInAuthScreenComponent,
    GoogleSignInButtonComponent,
  ],
  template: `
    <fui-sign-in-auth-screen
      forgotPasswordRoute="/forgot-password"
      registerRoute="/register"
    >
      <fui-google-sign-in-button></fui-google-sign-in-button>
      <div>
        <a routerLink="/sign-in/phone">Sign in with phone number</a>
      </div>
      <div>
        <a routerLink="/sign-in/email">Sign in with email link</a>
      </div>
    </fui-sign-in-auth-screen>
  `,
  styles: [],
})
export class SignInComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  
  ngOnInit() {
    // Check if user is already authenticated and redirect to home page
    authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }
}
