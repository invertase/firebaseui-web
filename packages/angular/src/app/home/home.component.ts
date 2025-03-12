import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">Firebase UI Demo</h1>
      
      <div class="mb-6" *ngIf="user$ | async as user">
        <div>Welcome: {{ user.email || user.phoneNumber }}</div>
      </div>
      
      <div>
        <h2 class="text-2xl font-bold mb-4">Auth Screens</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <li>
            <a
              routerLink="/auth/sign-in"
              class="text-blue-500 hover:underline"
            >
              Sign In Auth Screen
            </a>
          </li>
          <li>
            <a
              routerLink="/auth/register"
              class="text-blue-500 hover:underline"
            >
              Sign Up Auth Screen
            </a>
          </li>
          <li>
            <a
              routerLink="/auth/forgot-password"
              class="text-blue-500 hover:underline"
            >
              Password Reset Screen
            </a>
          </li>
          <li>
            <a
              routerLink="/auth/email-link"
              class="text-blue-500 hover:underline"
            >
              Email Link Auth Screen
            </a>
          </li>
          <li>
            <a
              routerLink="/auth/phone"
              class="text-blue-500 hover:underline"
            >
              Phone Auth Screen
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .p-8 {
      padding: 2rem;
    }
    
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .grid {
      display: grid;
    }
    
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    .gap-4 {
      gap: 1rem;
    }
    
    .text-blue-500 {
      color: #3b82f6;
    }
    
    .hover\:underline:hover {
      text-decoration: underline;
    }
    
    @media (min-width: 640px) {
      .sm\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 768px) {
      .md\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  
  `]
})
export class HomeComponent {
  private auth = inject(Auth);
  user$: Observable<User | null> = authState(this.auth);
  
  signOut() {
    this.auth.signOut();
  }
}
