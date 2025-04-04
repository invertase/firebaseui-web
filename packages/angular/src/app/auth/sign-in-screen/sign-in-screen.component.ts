import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { SignInAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-sign-in-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, SignInAuthScreenComponent],
  template: `
    <fui-sign-in-auth-screen></fui-sign-in-auth-screen>
  `,
  styles: []
})
export class SignInScreenComponent implements OnInit {
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
