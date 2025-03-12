import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./auth/sign-in').then(m => m.SignInComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/forgot-password').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'email-link',
        loadComponent: () => import('./auth/email-link').then(m => m.EmailLinkComponent)
      },
      {
        path: 'phone',
        loadComponent: () => import('./auth/phone').then(m => m.PhoneComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
