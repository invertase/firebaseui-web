import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { FuiInputCustomEvent } from '../../components';
import { EmailFormState } from '../../auth/login-form-controller';

@Component({
  tag: 'fui-email-form',
  styleUrl: 'fui-email-form.css',
})
export class FuiEmailForm {
  @Prop() state: EmailFormState;
  @Prop() validationErrors: { email?: string; password?: string } = {};
  @Prop() isSignIn: boolean = true;

  @Event() emailChange: EventEmitter<string>;
  @Event() passwordChange: EventEmitter<string>;
  @Event() toggleAuthMode: EventEmitter<void>;
  @Event() forgotPassword: EventEmitter<void>;

  private emailChanged(e: FuiInputCustomEvent<InputEvent>) {
    this.emailChange.emit((e.detail.target as HTMLInputElement).value);
  }

  private passwordChanged(e: FuiInputCustomEvent<InputEvent>) {
    this.passwordChange.emit((e.detail.target as HTMLInputElement).value);
  }

  render() {
    return (
      <div class="space-y-6">
        <fui-fieldset class="mb-4" inputId="email" label="Email" required={true} error={!!this.validationErrors.email} helpText={this.validationErrors.email}>
          <fui-input
            value={this.state?.email}
            onFuiInput={e => this.emailChanged(e)}
            error={!!this.validationErrors.email}
            inputProps={{
              type: 'email',
              placeholder: 'Email Address',
              required: true,
            }}
          />
        </fui-fieldset>

        <fui-fieldset inputId="password" label="Password" required={true} error={!!this.validationErrors.password} helpText={this.validationErrors.password}>
          <fui-input
            value={this.state?.password}
            onFuiInput={e => this.passwordChanged(e)}
            error={!!this.validationErrors.password}
            inputProps={{
              type: 'password',
              placeholder: 'Password',
              required: true,
            }}
          />
        </fui-fieldset>

        <div class="flex flex-col gap-2">
          <button type="button" class="text-sm text-gray-500 hover:text-gray-900 font-medium text-center" onClick={() => this.toggleAuthMode.emit()}>
            {this.isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
          {this.isSignIn && (
            <button type="button" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium text-center" onClick={() => this.forgotPassword.emit()}>
              Forgot your password?
            </button>
          )}
        </div>
      </div>
    );
  }
}
