import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { EmailLinkAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-email-link',
  standalone: true,
  imports: [CommonModule, RouterModule, EmailLinkAuthScreenComponent],
  template: `
    <fui-email-link-auth-screen></fui-email-link-auth-screen>
  `,
  styles: [],
})
export class EmailLinkComponent implements OnInit {
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
