import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { FirebaseUi } from '../../provider';
import { Auth, AuthProvider } from '@angular/fire/auth';
import { FirebaseUIError, fuiSignInWithOAuth } from '@firebase-ui/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'fui-oauth-button',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div>
      <fui-button
        type="button"
        (click)="handleOAuthSignIn()"
        class="fui-provider__button"
      >
        <ng-content></ng-content>
      </fui-button>
      <div class="fui-form__error" *ngIf="error">{{ error }}</div>
    </div>
  `,
})
export class OAuthButtonComponent implements OnInit {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);

  @Input() provider!: AuthProvider;

  error: string | null = null;

  ngOnInit() {
    if (!this.provider) {
      console.error('Provider is required for OAuthButtonComponent');
    }
  }

  async handleOAuthSignIn() {
    this.error = null;
    try {
      const config = await firstValueFrom(this.ui.config());

      await fuiSignInWithOAuth(this.auth, this.provider, {
        translations: config?.translations,
        language: config?.language,
        enableAutoUpgradeAnonymous: config?.enableAutoUpgradeAnonymous,
        enableHandleExistingCredential: config?.enableHandleExistingCredential,
      });
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        this.error = error.message;
        return;
      }
      console.error(error);
      firstValueFrom(this.ui.translation('errors', 'unknownError'))
        .then((message) => (this.error = message))
        .catch(() => (this.error = 'Unknown error'));
    }
  }
}
