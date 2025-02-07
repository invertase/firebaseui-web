import { Component, Input } from '@angular/core';

@Component({
  selector: 'fui-button',
  imports: [],
  templateUrl: './fui-button.component.html',
  styleUrl: './fui-button.component.css',
})
export class FuiButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() class = '';

  get buttonClasses(): string {
    return `fui-form__button ${
      this.variant === 'secondary' ? 'fui-form__button--secondary' : ''
    } ${this.class}`;
  }
}
