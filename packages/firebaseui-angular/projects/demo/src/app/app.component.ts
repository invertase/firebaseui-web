import { Component } from '@angular/core';
import { FuiButtonComponent } from '../../../firebaseui-angular/src/lib/fui-button/fui-button.component';

@Component({
  selector: 'app-root',
  imports: [FuiButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'demo';
}
