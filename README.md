# FirebaseUI for Web

This repository contains the source code for the FirebaseUI for Web project rewrite, focused on providing Authentication components for popular JavaScript frameworks.

## Installation

FirebaseUI requires the `firebase` package to be installed:

```bash
npm intall firebase
```

Next, follow the installation flow for your framework:

<details>
  <summary>React</summary>

  ```bash
  npm install @firebase-ui/react
  ```
</details>

<details>
  <summary>Angular</summary>

  FirebaseUI for Angular dependes on the [AngularFire](https://github.com/angular/angularfire) package:

  ```bash
  npm install @firebase-ui/angular @angular/fire
  ```
</details>


## Setup

FirebaseUI requires that your Firebase app is setup following the [Getting Started with Firebase](https://firebase.google.com/docs/web/setup) flow for Web:

```ts
import { initializeApp } from 'firebase/app';

const app = initializeApp({ ... });
```

Next, setup and configure FirebaseUI, import the `initializeUI` function from `@firebase-ui/core`:

```ts
import { initializeUI } from "@firebase-ui/core";

const ui = initializeUI();
```

> To learn more about configuring FirebaseUI, view the [configuration](#configuration) section.

Next, follow the flow for your framework to setup FirebaseUI:

<details>
  <summary>React</summary>

  FirebaseUI for React requires that your application be wrapped in the `ConfigProvider`, providing the initalized UI configuration. React expects the `FirebaseApp` instance be provided to the `initializeUI` configuration:

  ```tsx
  import { initializeApp } from 'firebase/app';
  import { initializeUI } from "@firebase-ui/core";
  import { ConfigProvider } from '@firebase-ui/react';

  const app = initializeApp({ ... });
  const ui = initializeUI({ app });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ConfigProvider config={ui}>
        <App />
      </ConfigProvider>
    </StrictMode>
  );
  ```
</details>

<details>
  <summary>Angular</summary>

  FirebaseUI depends on [AngularFire](https://github.com/angular/angularfire) being configured to inject Firebase Auth into your Angular application. Additionally, the `provideFirebaseUI` function is required to inject FirebaseUI into your application:

  ```tsx
  import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
  import { provideAuth, getAuth } from '@angular/fire/auth';
  import { provideFirebaseUI } from '@firebase-ui/angular';
  import { initializeUI } from '@firebase-ui/core';
  
  export const appConfig: ApplicationConfig = {
    providers: [
      provideFirebaseApp(() => initializeApp({ ... })),
      provideFirestore(() => getFirestore()),
      provideFirebaseUI(() => initializeUI({}))
      ...
    ],
    ...
  })
  ```
</details>

Next, import the CSS styles for the FirebaseUI project.

If you are using [TailwindCSS](https://tailwindcss.com/), import the base CSS from the `@firebase-ui/styles` package after your Tailwind import:

```css
@import "tailwindcss";
@import "@firebase-ui/styles/src/base.css";
```

If you are not using Tailwind, import the distributable CSS in your project:

```css
@import "@firebase-ui/styles/dist.css";
```

> To learn more about theming, view the [theming](#theming) section.

## Authentication Components

FirebaseUI provides a number of opinionated components designed to drop into your application which handle common user flows, such as signing in or registration.

### Sign-in

Allows users to sign in with an email and password:

<details>
  <summary>React</summary>

  ```tsx
  import { SignInAuthScreen } from '@firebase-ui/react';

  function App() {
    return <SignInAuthScreen />
  }
  ```

  Props: `onForgotPasswordClick` / `onRegisterClick`

  Additionally, allow the user to sign in with an OAuth provider by providing children:

  ```tsx
  import { SignInAuthScreen, GoogleSignInButton } from '@firebase-ui/react';

  function App() {
    return (
      <SignInAuthScreen>
        <GoogleSignInButton />
      </SignInAuthScreen>
    );
  }
  ```
</details>

<details>
  <summary>Angular</summary>

  ```tsx
  import { SignUpAuthScreenComponent } from "@firebase-ui/angular";

  @Component({
    selector: 'app-root',
    imports: [SignUpAuthScreenComponent],
    template: `<fui-sign-up-auth-screen></fui-sign-up-auth-screen>`,
  })
  export class AppComponent { }
  ```

  TODO: Props: `onForgotPasswordClick` / `onRegisterClick`

  TODO: Additionally, allow the user to sign in with an OAuth provider by providing children:

  ```tsx
  import { SignUpAuthScreenComponent } from "@firebase-ui/angular";

  @Component({
    selector: 'app-root',
    imports: [SignUpAuthScreenComponent],
    template: `<fui-sign-up-auth-screen></fui-sign-up-auth-screen>`,
  })
  export class AppComponent { }
  ```
</details>

## Configuration

TODO: Update once configuration is finalized.

### Theming

FirebaseUI provides a basic default theme out of the box, however the theme can be customized to match your application's design.

The package uses CSS Variables, which can be overridden in your application's CSS. Below is a list of all available variables:

```css
:root {
  /* The primary color is used for the button and link colors */
  --fui-primary: var(--color-black);
  /* The primary hover color is used for the button and link colors when hovered */
  --fui-primary-hover: --alpha(var(--fui-primary) / 85%);
  /* The primary surface color is used for the button text color */
  --fui-primary-surface: var(--color-white);
  /* The text color used for body text */
  --fui-text: var(--color-black);
  /* The muted text color used for body text, such as subtitles */
  --fui-text-muted: var(--color-gray-800);
  /* The background color of the cards */
  --fui-background: var(--color-white);
  /* The border color used for none input fields */
  --fui-border: var(--color-gray-200);
  /* The input color used for input fields */
  --fui-input: var(--color-gray-300);
  /* The error color used for error messages */
  --fui-error: var(--color-red-500);
  /* The radius used for the input fields */
  --fui-radius: var(--radius-sm);
  /* The radius used for the cards */
  --fui-radius-card: var(--radius-xl);
}
```

The default values are based on the [TailwindCSS](https://tailwindcss.com/docs/theme) theme variables. You can override these values with other TailwindCSS theme variables, or custom CSS values.
