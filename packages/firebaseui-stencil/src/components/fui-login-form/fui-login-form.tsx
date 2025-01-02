import { Component, Host, Method, Prop, State, h } from '@stencil/core';
import { LoginFormController, type AuthMode } from '../../auth/login-form-controller';
import { FuiInputCustomEvent } from '../../components';
import { z } from 'zod';
import '../../styles/global.css';

@Component({
  tag: 'fui-login-form',
  styleUrl: 'fui-login-form.css',
})
export class FuiLoginForm {
  @Prop() props: { [key: string]: any };
  @State() error: string | null = null;
  @State() validationErrors: { email?: string; password?: string } = {};
  @State() authMode: AuthMode = 'signIn';

  private controller: LoginFormController | null = null;

  connectedCallback() {
    this.controller = new LoginFormController();
  }

  disconnectedCallback() {
    this.controller?.dispose();
    this.controller = null;
  }

  @Method()
  public async submit() {
    this.onSubmit();
  }

  private toggleAuthMode() {
    this.authMode = this.authMode === 'signIn' ? 'signUp' : 'signIn';
    this.controller?.setAuthMode(this.authMode);
    this.error = null;
    this.validationErrors = {};
  }

  private emailChanged(e: FuiInputCustomEvent<InputEvent>) {
    this.error = null;
    this.validationErrors = {};
    this.controller?.updateEmail((e.detail.target as HTMLInputElement).value);
  }

  private passwordChanged(e: FuiInputCustomEvent<InputEvent>) {
    this.error = null;
    this.validationErrors = {};
    this.controller?.updatePassword((e.detail.target as HTMLInputElement).value);
  }

  private async onSubmit(e?: Event) {
    e?.preventDefault();
    this.error = null;
    this.validationErrors = {};

    const result = await this.controller?.submit('email');
    if (!result) return;

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        const errors = {};
        result.error.errors.forEach(error => {
          errors[error.path[0]] = error.message;
        });
        this.validationErrors = errors;
      }
      return;
    }

    if (!result.data.success) {
      this.error = result.data.error.message;
    }
  }

  render() {
    const isSignIn = this.authMode === 'signIn';

    return (
      <Host class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <h2 class="mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{isSignIn ? 'Sign in to your account' : 'Create a new account'}</h2>
            <form {...this.props} onSubmit={e => this.onSubmit(e)} class="space-y-6">
              <fui-fieldset class="mb-4" inputId="email" label="Email" required={true} error={!!this.validationErrors.email} helpText={this.validationErrors.email}>
                <fui-input
                  value={this.controller?.state.email}
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
                  value={this.controller?.state.password}
                  onFuiInput={e => this.passwordChanged(e)}
                  error={!!this.validationErrors.password}
                  inputProps={{
                    type: 'password',
                    placeholder: 'Password',
                    required: true,
                  }}
                />
              </fui-fieldset>

              {this.error && (
                <div class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">{this.error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div class="flex flex-col gap-3">
                <fui-button type="submit" fullWidth={true}>
                  {isSignIn ? 'Sign In' : 'Sign Up'}
                </fui-button>
                <button type="button" class="text-sm text-gray-500 hover:text-gray-900 font-medium text-center" onClick={() => this.toggleAuthMode()}>
                  {isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Host>
    );
  }
}
