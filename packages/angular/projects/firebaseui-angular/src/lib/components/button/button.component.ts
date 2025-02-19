import { Component, Directive, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'fui-button',
  template: `
    <button
      class="fui-button"
      [type]="type">
      <ng-content></ng-content>
    </button>
  `,
  standalone: true,
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}