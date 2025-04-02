import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseUi } from '../../provider';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fui-terms-and-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-text-muted text-xs text-start my-6" *ngIf="shouldShow | async">
      <ng-container *ngFor="let part of parts | async; let i = index">
        <a 
          *ngIf="part.type === 'tos' && (tosUrl | async)"
          [href]="tosUrl | async"
          target="_blank"
          rel="noopener noreferrer"
          class="text-text-muted hover:underline text-xs"
        >
          {{ termsText | async }}
        </a>
        <a 
          *ngIf="part.type === 'privacy' && (privacyPolicyUrl | async)"
          [href]="privacyPolicyUrl | async"
          target="_blank"
          rel="noopener noreferrer"
          class="text-text-muted hover:underline text-xs"
        >
          {{ privacyText | async }}
        </a>
        <ng-container *ngIf="part.type === 'text'">{{ part.content }}</ng-container>
      </ng-container>
    </div>
  `
})
export class TermsAndPrivacyComponent {
  private ui = inject(FirebaseUi);

  tosUrl = this.ui.config().pipe(
    map(config => config?.tosUrl)
  );

  privacyPolicyUrl = this.ui.config().pipe(
    map(config => config?.privacyPolicyUrl)
  );

  shouldShow = this.ui.config().pipe(
    map(config => !!(config?.tosUrl || config?.privacyPolicyUrl))
  );

  termsText = this.ui.translation('labels', 'termsOfService');
  privacyText = this.ui.translation('labels', 'privacyPolicy');
  
  parts = this.ui.translation('messages', 'termsAndPrivacy').pipe(
    map(text => {
      const parts = text.split(/({tos}|{privacy})/);
      return parts.map(part => {
        if (part === '{tos}') {
          return { type: 'tos' };
        }
        if (part === '{privacy}') {
          return { type: 'privacy' };
        }
        return { type: 'text', content: part };
      });
    })
  );
}
