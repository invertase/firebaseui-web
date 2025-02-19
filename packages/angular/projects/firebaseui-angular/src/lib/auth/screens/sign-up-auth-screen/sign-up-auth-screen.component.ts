import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardSubtitleComponent } from '../../../components/card/card.component';

import { FirebaseUi } from '../../../provider';
import { RegisterFormComponent } from '../../forms/register-form/register-form.component';

@Component({
  selector: 'fui-sign-up-auth-screen',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    RegisterFormComponent,
  ],
  template: `
    <div class="fui-screen">
      <fui-card>
        <fui-card-header>
          <fui-card-title>{{ titleText | async }}</fui-card-title>
          <fui-card-subtitle>{{ subtitleText | async }}</fui-card-subtitle>
        </fui-card-header>
        <fui-register-form></fui-register-form>
      </fui-card>
    </div>
  `
})
export class SignUpAuthScreenComponent {
  private ui = inject(FirebaseUi);

  @Output() onBackToSignInClick = new EventEmitter<void>();

  get titleText() {
    return this.ui.translation('labels', 'register');
  }

  get subtitleText() {
    return this.ui.translation('prompts', 'enterDetailsToCreate');
  }
}
