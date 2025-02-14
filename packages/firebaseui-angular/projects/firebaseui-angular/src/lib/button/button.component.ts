import { Component, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'button[fui-button]',
  standalone: true,
  host: {
    'class': 'fui-button',
    '[class]': 'className',
    '[attr.type]': 'type || "button"'
  }
})
export class ButtonDirective {
  @Input() className?: string;
  @Input() type?: 'button' | 'submit' | 'reset';

  constructor(private el: ElementRef<HTMLButtonElement>) {}
}

@Component({
  selector: 'fui-button',
  template: `
    <button fui-button 
      [class]="className"
      [type]="type">
      <ng-content></ng-content>
    </button>
  `,
  standalone: true,
  imports: [ButtonDirective]
})
export class ButtonComponent {
  @Input() className?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}