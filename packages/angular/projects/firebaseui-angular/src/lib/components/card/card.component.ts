import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fui-card',
  standalone: true,
  imports: [],
  template: `
    <div class="fui-card">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
}

@Component({
  selector: 'fui-card-header',
  standalone: true,
  imports: [CommonModule],
  host: {
    style: 'display: block;',
  },
  template: `
    <div class="fui-card__header">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {
}

@Component({
  selector: 'fui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="fui-card__title">
      <ng-content></ng-content>
    </h2>
  `,
})
export class CardTitleComponent {
}

@Component({
  selector: 'fui-card-subtitle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="fui-card__subtitle">
      <ng-content></ng-content>
    </p>
  `,
})
export class CardSubtitleComponent {
}
