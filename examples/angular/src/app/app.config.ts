import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyAotbJXqnZxg9aAsULFn8MLwp_twtMUl2k',
        authDomain: 'ff-test-74aeb.firebaseapp.com',
        databaseURL:
          'https://ff-test-74aeb-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: 'ff-test-74aeb',
        storageBucket: 'ff-test-74aeb.appspot.com',
        messagingSenderId: '950537677105',
        appId: '1:950537677105:web:da72ccc1718279f3cde810',
        measurementId: 'G-B5Y2YD83TJ',
      }),
    ),
    provideAuth(() => getAuth()),
  ],
};
