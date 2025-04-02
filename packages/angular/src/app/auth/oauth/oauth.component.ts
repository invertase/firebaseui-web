import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { OAuthScreenComponent, GoogleSignInButtonComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule, RouterModule, OAuthScreenComponent, GoogleSignInButtonComponent],
  template: `
    <fui-oauth-screen>
      <fui-google-sign-in-button></fui-google-sign-in-button>
    </fui-oauth-screen>
  `,
  styles: []
})
export class OAuthComponent implements OnInit {
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
