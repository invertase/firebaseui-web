import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUpAuthScreenComponent } from "@firebase-ui/angular";

@Component({
  selector: 'app-root',
  imports: [SignUpAuthScreenComponent],
  template: `<fui-sign-up-auth-screen></fui-sign-up-auth-screen>`,
})
export class AppComponent {
  title = 'angular-ssr';
}
