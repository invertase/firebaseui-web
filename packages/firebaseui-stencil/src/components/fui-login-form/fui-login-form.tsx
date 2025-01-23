import { Component, Host, Method, Prop, State, h, Element, Watch } from '@stencil/core';
import { LoginFormController, type AuthMode, type LoginType, type EmailFormState, type PhoneFormState, type EmailLinkFormState } from '../../auth/login-form-controller';
import { z } from 'zod';
import { RecaptchaVerifier } from 'firebase/auth';
import '../../styles/global.css';
import { FUIConfigStore } from '../../config';

@Component({
  tag: 'fui-login-form',
  styleUrl: 'fui-login-form.css',
})
export class FuiLoginForm {
  @Element() el: HTMLElement;
  @Prop() formFroms: { [key: string]: any };
  @Prop() config: FUIConfigStore;
  @Prop() loginType: LoginType = 'email';

  @State() error: string | null = null;
  @State() validationErrors: { email?: string; password?: string; phoneNumber?: string; verificationCode?: string } = {};
  @State() authMode: AuthMode = 'signIn';
  @State() verificationSent: boolean = false;
  @State() canSubmitPhone: boolean = false;
  @State() successMessage: string | null = null;
  @State() showForgotPassword: boolean = false;
  @State() forgotPasswordEmail: string = '';
  @State() emailLinkSent: boolean = false;

  private controller: LoginFormController | null = null;

  // Lifecycle methods
  connectedCallback() {
    console.log('Connecting login form', this.controller);
    this.controller = new LoginFormController(this.config);
    this.controller.setLoginType(this.loginType);
    this.controller.reset();
    console.log('Login form controller set', this.controller);
    this.checkEmailLink();
    this.checkRedirectResult();
  }

  disconnectedCallback() {
    console.log('Disconnecting login form');
    this.controller?.dispose();
    this.controller = null;
    this.resetState();
  }

  // Watchers
  @Watch('loginType')
  handleLoginTypeChange(newValue: LoginType) {
    if (this.controller) {
      this.controller.setLoginType(newValue);
      if (newValue === 'phone') {
        this.canSubmitPhone = false;
      }
    }
  }

  // Public methods
  @Method()
  public async submit() {
    return this.handleSubmit();
  }

  public getController(): LoginFormController | null {
    return this.controller;
  }

  // Event handlers
  private handleAuthModeToggle = () => {
    this.authMode = this.authMode === 'signIn' ? 'signUp' : 'signIn';
    this.controller?.setAuthMode(this.authMode);
    this.resetErrors();
  };

  private handleRecaptchaVerifierChange = (e: CustomEvent<RecaptchaVerifier>) => {
    if (this.controller) {
      console.log('Setting recaptcha verifier', e.detail);
      this.controller.setRecaptchaVerifier(e.detail);
      // Only reset state when initializing (not after verification)
      if (e.detail && !this.canSubmitPhone) {
        this.resetState();
      }
    }
  };

  private handlePhoneSubmitStateChange = (e: CustomEvent<boolean>) => {
    this.canSubmitPhone = e.detail;
    this.error = null;
  };

  private async handleSubmit(e?: Event) {
    e?.preventDefault();
    this.resetErrors();

    console.log('Submit handler - State:', {
      loginType: this.loginType,
      verificationSent: this.verificationSent,
      canSubmitPhone: this.canSubmitPhone,
      state: this.controller?.state,
    });

    // For phone auth, only allow submission when reCAPTCHA is verified (for sending code)
    // or when in verification mode (for confirming code)
    if (this.loginType === 'phone' && !this.verificationSent && !this.canSubmitPhone) {
      console.log('Submit blocked - reCAPTCHA not verified');
      this.error = 'Please complete the reCAPTCHA verification first';
      return;
    }

    const result = await this.controller?.submit(this.loginType);
    console.log('Submit result:', result);
    if (!result) return;

    if (!result.success) {
      console.log('Submit error:', result.error);
      this.handleSubmissionError(result.error);
      return;
    }

    if (!result.data.success) {
      console.log('Auth error:', result.data.error);
      this.error = result.data.error.message;
      return;
    }

    if (this.loginType === 'phone' && !this.verificationSent) {
      console.log('Phone verification code sent');
      this.verificationSent = true;
    } else if (this.loginType === 'emailLink' && !this.emailLinkSent) {
      console.log('Email link sent');
      this.emailLinkSent = true;
      this.successMessage = result.data.message || 'Sign-in link sent successfully. Please check your email.';
    }
  }

  // Helper methods
  private resetErrors() {
    this.error = null;
    this.validationErrors = {};
  }

  private resetState() {
    this.controller?.reset();
    this.canSubmitPhone = false;
    this.verificationSent = false;
    this.error = null;
    this.validationErrors = {};
  }

  private handleSubmissionError(error: any) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      this.validationErrors = errors;
    }
  }

  private async handlePasswordReset() {
    this.resetErrors();
    const result = await this.controller?.handlePasswordReset();
    if (!result) return;

    if (!result.success) {
      this.error = result.error?.message;
      return;
    }

    this.error = null;
    this.successMessage = result.message || 'Password reset email sent successfully';
  }

  private handleForgotPasswordClick = () => {
    this.showForgotPassword = true;
    this.resetErrors();
    this.forgotPasswordEmail = (this.controller?.state as EmailFormState)?.email || '';
  };

  private handleBackToLogin = () => {
    this.showForgotPassword = false;
    this.resetErrors();
    this.resetState();
    this.successMessage = null;
  };

  private handleForgotPasswordEmailChange = (e: CustomEvent<string>) => {
    this.forgotPasswordEmail = e.detail;
    this.controller?.updateEmail(e.detail);
  };

  private handleForgotPasswordSubmit = async () => {
    await this.handlePasswordReset();
  };

  private renderEmailForm() {
    if (this.loginType !== 'email') return null;

    return (
      <fui-email-form
        config={this.config}
        state={this.controller?.state as EmailFormState}
        validationErrors={this.validationErrors}
        isSignIn={this.authMode === 'signIn'}
        onEmailChange={e => this.controller?.updateEmail(e.detail)}
        onPasswordChange={e => this.controller?.updatePassword(e.detail)}
        onToggleAuthMode={this.handleAuthModeToggle}
        onForgotPassword={this.handleForgotPasswordClick}
      />
    );
  }

  private renderPhoneForm() {
    if (this.loginType !== 'phone') return null;

    return (
      <fui-phone-form
        config={this.config}
        state={this.controller?.state as PhoneFormState}
        validationErrors={this.validationErrors}
        verificationSent={this.verificationSent}
        onPhoneNumberChange={e => this.controller?.updatePhoneNumber(e.detail)}
        onVerificationCodeChange={e => this.controller?.updateVerificationCode(e.detail)}
        onRecaptchaVerifierChange={this.handleRecaptchaVerifierChange}
        onCanSubmit={this.handlePhoneSubmitStateChange}
        onVerificationSentChange={e => (this.verificationSent = e.detail)}
        onFormStateChange={e => {
          this.controller?.updatePhoneNumber(e.detail.phoneNumber);
          this.controller?.updateVerificationCode(e.detail.verificationCode);
        }}
      />
    );
  }

  private renderEmailLinkForm() {
    if (this.loginType !== 'emailLink') return null;

    return (
      <fui-email-link-form
        config={this.config}
        state={this.controller?.state as EmailLinkFormState}
        validationErrors={this.validationErrors}
        linkSent={this.emailLinkSent}
        onEmailChange={e => this.controller?.updateEmail(e.detail)}
      />
    );
  }

  private renderGoogleSignIn() {
    if (this.loginType !== 'google') return null;

    return (
      <fui-google-sign-in
        onSignedIn={async () => {
          this.resetErrors();
          const result = await this.controller?.submit('google');
          if (!result?.success || !result.data?.success) {
            this.error = result?.data?.error?.message || 'Failed to sign in with Google. Please try again.';
          }
        }}
      />
    );
  }

  private renderError() {
    if (!this.error) return null;

    return (
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
    );
  }

  private renderSuccess() {
    if (!this.successMessage) return null;

    return (
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
    );
  }

  private renderForgotPasswordForm() {
    return (
      <fui-forgot-password-form
        config={this.config}
        email={this.forgotPasswordEmail}
        error={this.error}
        successMessage={this.successMessage}
        onEmailChange={this.handleForgotPasswordEmailChange}
        onSubmitReset={this.handleForgotPasswordSubmit}
        onBackToLogin={this.handleBackToLogin}
      />
    );
  }

  private getSubmitButtonText(): string {
    if (this.loginType === 'phone') {
      return this.verificationSent ? 'Verify Code' : 'Send Code';
    }
    if (this.loginType === 'emailLink') {
      return this.emailLinkSent ? 'Check your email' : 'Send sign-in link';
    }
    return this.authMode === 'signIn' ? 'Sign In' : 'Sign Up';
  }

  private async checkEmailLink() {
    if (!this.controller) return;

    const currentUrl = window.location.href;
    if (this.controller.isEmailLinkSignIn(currentUrl)) {
      console.log('Email link sign-in detected');
      const email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        this.error = 'No email found for sign-in. Please try again.';
        return;
      }

      this.controller.updateEmail(email);
      const result = await this.controller.submit('emailLink');
      if (!result?.success || !result.data.success) {
        this.error = result?.data?.error?.message || 'Failed to sign in with email link. Please try again.';
        return;
      }

      window.localStorage.removeItem('emailForSignIn');
      this.successMessage = 'Successfully signed in with email link!';
    }
  }

  private async checkRedirectResult() {
    if (!this.controller) return;

    const result = await this.controller.handleRedirectResult();
    if (!result?.success) {
      this.error = result?.data?.error?.message || 'Failed to complete sign in. Please try again.';
      return;
    }

    if (result.data?.data) {
      this.successMessage = 'Successfully signed in!';
    }
  }

  render() {
    return (
      <Host class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {!this.showForgotPassword ? (
              <form {...this.formFroms} onSubmit={e => this.handleSubmit(e)} class="space-y-6">
                <h2 class="mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  {this.authMode === 'signIn' ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                {this.renderEmailForm()}
                {this.renderPhoneForm()}
                {this.renderEmailLinkForm()}
                {this.renderGoogleSignIn()}
                {this.renderError()}
                {this.renderSuccess()}
                {this.loginType !== 'google' && (
                  <div class="flex flex-col gap-3">
                    <fui-button type="submit" fullWidth={true}>
                      {this.getSubmitButtonText()}
                    </fui-button>
                  </div>
                )}
              </form>
            ) : (
              this.renderForgotPasswordForm()
            )}
          </div>
        </div>
      </Host>
    );
  }
}
