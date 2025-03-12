import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f9fafb;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `]
})
export class AppComponent {
  title = 'Firebase UI Angular Example';
}
