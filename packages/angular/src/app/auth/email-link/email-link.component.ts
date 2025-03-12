import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmailLinkAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-email-link',
  standalone: true,
  imports: [CommonModule, RouterModule, EmailLinkAuthScreenComponent],
  template: `
    <fui-email-link-auth-screen
      [signInRoute]="'/auth/sign-in'"
      (onBackToSignInClick)="navigateTo('/auth/sign-in')"
    ></fui-email-link-auth-screen>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class EmailLinkComponent {
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
