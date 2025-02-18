import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { FirebaseUi } from '../../../provider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fui-register-form',
  imports: [CommonModule, ButtonComponent],
  template: `
    <form class="fui-form">
      <fieldset>
        <label for="email">
          <span>
            {{ emailLabel | async }}
          </span>
          <input type="email" id="email" />
        </label>
      </fieldset>
      <fieldset>
        <label for="password">
          <span>
            {{ passwordLabel | async }}
          </span>
          <input type="password" id="password" />
        </label>
      </fieldset>
      <fieldset>
        <fui-button type="submit">
          {{ createAccountLabel | async }}
        </fui-button>
      </fieldset>
    </form>
  `
})
export class RegisterFormComponent {
  private ui = inject(FirebaseUi);

  get emailLabel() {
    return this.ui.translation('labels', 'emailAddress');
  }

  get passwordLabel() {
    return this.ui.translation('labels', 'password');
  }

  get createAccountLabel() {
    return this.ui.translation('labels', 'createAccount');
  }
}