import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { FuiInputCustomEvent } from '../../components';
import { EmailLinkFormState } from '../../auth/login-form-controller';

@Component({
  tag: 'fui-email-link-form',
  styleUrl: 'fui-email-link-form.css',
})
export class FuiEmailLinkForm {
  @Prop() state: EmailLinkFormState;
  @Prop() validationErrors: { email?: string } = {};
  @Prop() linkSent: boolean = false;

  @Event() emailChange: EventEmitter<string>;

  private handleEmailChange = (e: FuiInputCustomEvent<InputEvent>) => {
    this.emailChange.emit((e.detail.target as HTMLInputElement).value);
  };

  render() {
    if (this.linkSent) {
      return (
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
          <p class="text-sm text-gray-600">We've sent you a magic link to sign in. Please check your email and click the link to continue.</p>
        </div>
      );
    }

    return (
      <div class="space-y-6">
        <fui-fieldset class="mb-4" inputId="email" label="Email" required={true} error={!!this.validationErrors.email} helpText={this.validationErrors.email}>
          <fui-input
            value={this.state?.email}
            onFuiInput={this.handleEmailChange}
            error={!!this.validationErrors.email}
            inputProps={{
              type: 'email',
              placeholder: 'Email Address',
              required: true,
            }}
          />
        </fui-fieldset>
      </div>
    );
  }
}
