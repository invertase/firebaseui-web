import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { SignUpAuthScreenComponent, GoogleSignInButtonComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, SignUpAuthScreenComponent, GoogleSignInButtonComponent],
  template: `
    <fui-sign-up-auth-screen signInRoute="/sign-in">
      <fui-google-sign-in-button></fui-google-sign-in-button>
    </fui-sign-up-auth-screen>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
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
