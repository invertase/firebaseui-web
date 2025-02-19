import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUpAuthScreenComponent } from "@firebase-ui/angular";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SignUpAuthScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ssr';
}
