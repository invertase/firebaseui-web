import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { FuiInputCustomEvent } from '../../components';
import { FUIConfigStore } from '../../config';

@Component({
  tag: 'fui-forgot-password-form',
  styleUrl: 'fui-forgot-password-form.css',
})
export class FuiForgotPasswordForm {
  @Prop() config: FUIConfigStore;
  @Prop() email: string = '';
  @Prop() error?: string;
  @Prop() successMessage?: string;

  @Event() emailChange: EventEmitter<string>;
  @Event() submitReset: EventEmitter<void>;
  @Event() backToLogin: EventEmitter<void>;

  private handleEmailChange(e: FuiInputCustomEvent<InputEvent>) {
    this.emailChange.emit((e.detail.target as HTMLInputElement).value);
  }

  render() {
    return (
      <Host>
        <div class="space-y-6">
          <h2 class="mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset your password</h2>
          <p class="text-sm text-gray-600 text-center mb-6">Enter your email address and we'll send you a link to reset your password.</p>

          <fui-fieldset inputId="email" label="Email" required={true} error={!!this.error} helpText={this.error}>
            <fui-input
              value={this.email}
              onFuiInput={e => this.handleEmailChange(e)}
              error={!!this.error}
              inputProps={{
                type: 'email',
                placeholder: 'Email Address',
                required: true,
              }}
            />
          </fui-fieldset>

          {this.successMessage && (
            <div class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">{this.successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div class="flex flex-col gap-3">
            <fui-button type="submit" fullWidth={true} onClick={() => this.submitReset.emit()}>
              Send Reset Link
            </fui-button>
            <button type="button" class="text-sm text-gray-500 hover:text-gray-900 font-medium text-center" onClick={() => this.backToLogin.emit()}>
              Back to login
            </button>
          </div>
        </div>
      </Host>
    );
  }
}
