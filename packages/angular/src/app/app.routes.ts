import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home').then(m => m.HomeComponent)
  },
  // Direct auth routes (matching NextJS paths)
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
  // Sign-in subdirectories
  {
    path: 'sign-in/phone',
    loadComponent: () => import('./auth/phone').then(m => m.PhoneComponent)
  },
  {
    path: 'sign-in/email',
    loadComponent: () => import('./auth/email-link').then(m => m.EmailLinkComponent)
  },
  // Screen routes
  {
    path: 'screens/sign-in-auth-screen',
    loadComponent: () => import('./auth/sign-in-screen').then(m => m.SignInScreenComponent)
  },
  {
    path: 'screens/sign-in-auth-screen-w-handlers',
    loadComponent: () => import('./auth/sign-in-handlers').then(m => m.SignInHandlersComponent)
  },
  {
    path: 'screens/sign-in-auth-screen-w-oauth',
    loadComponent: () => import('./auth/sign-in-oauth').then(m => m.SignInOAuthComponent)
  },
  {
    path: 'screens/email-link-auth-screen',
    loadComponent: () => import('./auth/email-link-screen').then(m => m.EmailLinkScreenComponent)
  },
  {
    path: 'screens/email-link-auth-screen-w-oauth',
    loadComponent: () => import('./auth/email-link-oauth').then(m => m.EmailLinkOAuthComponent)
  },
  {
    path: 'screens/phone-auth-screen',
    loadComponent: () => import('./auth/phone-screen').then(m => m.PhoneScreenComponent)
  },
  {
    path: 'screens/phone-auth-screen-w-oauth',
    loadComponent: () => import('./auth/phone-oauth').then(m => m.PhoneOAuthComponent)
  },
  {
    path: 'screens/sign-up-auth-screen',
    loadComponent: () => import('./auth/sign-up').then(m => m.SignUpComponent)
  },
  {
    path: 'screens/sign-up-auth-screen-w-oauth',
    loadComponent: () => import('./auth/register-oauth').then(m => m.RegisterOAuthComponent)
  },
  {
    path: 'screens/oauth-screen',
    loadComponent: () => import('./auth/oauth').then(m => m.OAuthComponent)
  },
  {
    path: 'screens/password-reset-screen',
    loadComponent: () => import('./auth/password-reset').then(m => m.PasswordResetComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
