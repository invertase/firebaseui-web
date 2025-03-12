import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardSubtitleComponent } from '../../../components/card/card.component';
import { FirebaseUi } from '../../../provider';
import { ForgotPasswordFormComponent } from '../../forms/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'fui-password-reset-screen',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    ForgotPasswordFormComponent,
  ],
  template: `
    <div class="fui-screen">
      <fui-card>
        <fui-card-header>
          <fui-card-title>{{ titleText | async }}</fui-card-title>
          <fui-card-subtitle>{{ subtitleText | async }}</fui-card-subtitle>
        </fui-card-header>
        <fui-forgot-password-form 
          [signInRoute]="signInRoute"
          (onBackToSignInClick)="onBackToSignInClick.emit()"
        ></fui-forgot-password-form>
      </fui-card>
    </div>
  `
})
export class PasswordResetScreenComponent {
  private ui = inject(FirebaseUi);
  
  @Input() signInRoute: string = '';
  @Output() onBackToSignInClick = new EventEmitter<void>();

  get titleText() {
    return this.ui.translation('labels', 'resetPassword');
  }

  get subtitleText() {
    return this.ui.translation('prompts', 'enterEmailToReset');
  }
}
