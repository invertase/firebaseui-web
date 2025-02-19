import { Component, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fui-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fui-divider">
      <div class="fui-divider__line"></div>
      <div class="fui-divider__text" *ngIf="hasContent">
        <ng-content></ng-content>
      </div>
      <div class="fui-divider__line" *ngIf="hasContent"></div>
    </div>
  `,
})
export class DividerComponent {
  get hasContent(): boolean {
    const element = this.elementRef.nativeElement;
    return element.childNodes.length > 0;
  }

  constructor(private elementRef: ElementRef) {}
}
