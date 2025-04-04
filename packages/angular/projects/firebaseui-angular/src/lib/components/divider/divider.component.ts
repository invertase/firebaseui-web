import { Component, Input, ElementRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fui-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fui-divider my-6">
      <div class="fui-divider__line"></div>
      <div class="fui-divider__text" *ngIf="hasContent">
        <ng-content></ng-content>
      </div>
      <div class="fui-divider__line" *ngIf="hasContent"></div>
    </div>
  `,
})
export class DividerComponent implements AfterContentInit {
  hasContent = false;

  @Input() text: string = '';

  get textContent(): string {
    return this.text;
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    // Check if text input is provided
    if (this.text) {
      this.hasContent = true;
      return;
    }

    // Otherwise check for projected content
    const directContent = this.elementRef.nativeElement.textContent?.trim();
    if (directContent) {
      this.hasContent = true;
    }
  }
}
