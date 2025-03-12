import { Component, Directive, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'fui-button',
  template: `
    <button
      class="fui-button"
      [class.fui-button--secondary]="variant === 'secondary'"
      [type]="type"
      [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
  standalone: true,
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'secondary' = 'primary';
}