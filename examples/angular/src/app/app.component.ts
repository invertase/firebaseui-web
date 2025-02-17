import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '@firebase-ui/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent],
  standalone: true,
  template: `
    <h1>Hello World</h1>
    <fui-button>Click me</fui-button>
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'angular';
}
