import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { PhoneAuthScreenComponent, GoogleSignInButtonComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-phone-oauth',
  standalone: true,
  imports: [CommonModule, RouterModule, PhoneAuthScreenComponent, GoogleSignInButtonComponent],
  template: `
    <fui-phone-auth-screen>
      <fui-google-sign-in-button></fui-google-sign-in-button>
    </fui-phone-auth-screen>
  `,
  styles: []
})
export class PhoneOAuthComponent implements OnInit {
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
