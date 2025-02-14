import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseUIModule } from '@firebase-ui/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FirebaseUIModule],
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular';
}
