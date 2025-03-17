import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirebaseUI } from '@firebase-ui/angular';
import { initializeUI } from '@firebase-ui/core';

const firebaseConfig = {
  apiKey: 'AIzaSyAotbJXqnZxg9aAsULFn8MLwp_twtMUl2k',
  authDomain: 'ff-test-74aeb.firebaseapp.com',
  databaseURL:
    'https://ff-test-74aeb-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ff-test-74aeb',
  storageBucket: 'ff-test-74aeb.appspot.com',
  messagingSenderId: '950537677105',
  appId: '1:950537677105:web:da72ccc1718279f3cde810',
  measurementId: 'G-B5Y2YD83TJ',
};

// Create a Firebase UI config that matches the NextJS example
const firebaseUIConfig = {
  app: undefined, // This will be set by the provider
  tosUrl: 'https://www.google.com',
  privacyPolicyUrl: 'https://www.google.com',
  translations: {
    en: {
      labels: {
        signIn: 'Sign In',
      },
      prompts: {
        signInToAccount: 'Sign in to your account',
      },
      errors: {
        invalidEmail: 'Please enter a valid email address',
      },
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      connectAuthEmulator(auth, 'http://localhost:9099');
      return auth;
    }),
    provideFirebaseUI(() => initializeUI(firebaseUIConfig)),
  ],
};
