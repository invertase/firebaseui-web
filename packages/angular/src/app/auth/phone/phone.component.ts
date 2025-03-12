import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PhoneAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [CommonModule, RouterModule, PhoneAuthScreenComponent],
  template: `
    <fui-phone-auth-screen
      [signInRoute]="'/auth/sign-in'"
      (onBackToSignInClick)="navigateTo('/auth/sign-in')"
    ></fui-phone-auth-screen>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class PhoneComponent {
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
