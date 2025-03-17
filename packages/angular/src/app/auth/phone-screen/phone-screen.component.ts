import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { PhoneAuthScreenComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-phone-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, PhoneAuthScreenComponent],
  template: `
    <fui-phone-auth-screen [resendDelay]="2"></fui-phone-auth-screen>
  `,
  styles: []
})
export class PhoneScreenComponent implements OnInit {
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
