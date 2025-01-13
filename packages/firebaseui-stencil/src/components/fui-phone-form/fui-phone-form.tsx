import { Component, h, Prop, Event, EventEmitter, Element, Watch, State, Fragment } from '@stencil/core';
import { FuiInputCustomEvent } from '../../components';
import { PhoneFormState } from '../../auth/login-form-controller';
import { RecaptchaVerifier } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { FUIConfigStore } from '../../config';

@Component({
  tag: 'fui-phone-form',
  styleUrl: 'fui-phone-form.css',
})
export class FuiPhoneForm {
  @Element() el: HTMLElement;
  @Prop() config: FUIConfigStore;
  @Prop() state: PhoneFormState;
  @Prop() validationErrors: { phoneNumber?: string; verificationCode?: string } = {};
  @Prop() verificationSent: boolean = false;
  @State() isRecaptchaVerified: boolean = false;

  @Event() phoneNumberChange: EventEmitter<string>;
  @Event() verificationCodeChange: EventEmitter<string>;
  @Event() recaptchaVerifierChange: EventEmitter<RecaptchaVerifier>;
  @Event() recaptchaVerified: EventEmitter<void>;
  @Event() canSubmit: EventEmitter<boolean>;
  @Event() verificationSentChange: EventEmitter<boolean>;
  @Event() formStateChange: EventEmitter<PhoneFormState>;

  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private recaptchaContainer: HTMLDivElement;
  private recaptchaWidgetId: number | null = null;

  // Lifecycle methods
  componentDidLoad() {
    console.log('PhoneForm componentDidLoad');
    this.initializeRecaptcha();
  }

  disconnectedCallback() {
    console.log('PhoneForm disconnectedCallback');
    this.clearRecaptcha();
    this.resetState();
  }

  // Watchers
  @Watch('verificationSent')
  handleVerificationSentChange(newValue: boolean) {
    if (!newValue) {
      this.isRecaptchaVerified = false;
      this.initializeRecaptcha();
    }
  }

  @Watch('validationErrors')
  handleValidationErrorsChange(newValue: { phoneNumber?: string }) {
    if (newValue.phoneNumber) {
      this.isRecaptchaVerified = false;
      this.resetRecaptcha();
    }
  }

  @Watch('isRecaptchaVerified')
  handleRecaptchaVerifiedChange(newValue: boolean) {
    // Emit whether the form can be submitted (only when not in verification mode)
    if (!this.verificationSent) {
      this.canSubmit.emit(newValue);
    }
  }

  // Event handlers
  private handlePhoneNumberChange = (e: FuiInputCustomEvent<InputEvent>) => {
    this.phoneNumberChange.emit((e.detail.target as HTMLInputElement).value);
  };

  private handleVerificationCodeChange = (e: FuiInputCustomEvent<InputEvent>) => {
    this.verificationCodeChange.emit((e.detail.target as HTMLInputElement).value);
  };

  // reCAPTCHA methods
  private async initializeRecaptcha() {
    try {
      this.clearRecaptcha();
      if (!this.recaptchaContainer) return;

      const auth = getAuth(this.config.state.app);
      this.recaptchaVerifier = new RecaptchaVerifier(auth, this.recaptchaContainer, {
        'size': 'normal',
        'callback': this.handleRecaptchaSuccess,
        'expired-callback': this.handleRecaptchaExpired,
        'error-callback': this.handleRecaptchaError,
      });

      this.recaptchaWidgetId = await this.recaptchaVerifier.render();
      this.recaptchaVerifierChange.emit(this.recaptchaVerifier);

      console.log('Recaptcha verifier set', this.recaptchaVerifier, this.recaptchaWidgetId);
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      setTimeout(() => this.initializeRecaptcha(), 1000);
    }
  }

  private handleRecaptchaSuccess = () => {
    this.isRecaptchaVerified = true;
    this.recaptchaVerified.emit();
    this.recaptchaVerifierChange.emit(this.recaptchaVerifier);
  };

  private handleRecaptchaExpired = () => {
    this.isRecaptchaVerified = false;
    this.resetRecaptcha();
  };

  private handleRecaptchaError = () => {
    this.isRecaptchaVerified = false;
    this.resetRecaptcha();
  };

  private async resetRecaptcha() {
    if (this.recaptchaWidgetId !== null) {
      try {
        (window as any).grecaptcha.reset(this.recaptchaWidgetId);
      } catch (e) {
        await this.initializeRecaptcha();
      }
    }
    this.recaptchaVerifierChange.emit(this.recaptchaVerifier);
  }

  private clearRecaptcha() {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (e) {
        console.warn('Error clearing reCAPTCHA:', e);
      }
      this.recaptchaVerifier = null;
      this.recaptchaWidgetId = null;
      this.recaptchaVerifierChange.emit(null);
    }
  }

  private resetState() {
    const newState = {
      phoneNumber: '',
      verificationCode: '',
    };
    this.formStateChange.emit(newState);
    this.verificationSentChange.emit(false);
    this.isRecaptchaVerified = false;
    this.recaptchaVerifier = null;
    this.recaptchaWidgetId = null;
    this.recaptchaVerifierChange.emit(null);
    this.canSubmit.emit(false);
  }

  // Render methods
  private renderPhoneNumberInput() {
    return (
      <fui-fieldset
        class="mb-4"
        inputId="phoneNumber"
        label="Phone Number"
        required={true}
        error={!!this.validationErrors.phoneNumber}
        helpText={this.validationErrors.phoneNumber}
      >
        <fui-input
          value={this.state?.phoneNumber}
          onFuiInput={this.handlePhoneNumberChange}
          error={!!this.validationErrors.phoneNumber}
          inputProps={{
            type: 'tel',
            placeholder: '+1 (555) 555-5555',
            required: true,
          }}
        />
      </fui-fieldset>
    );
  }

  private renderVerificationCodeInput() {
    if (!this.verificationSent) return null;

    return (
      <fui-fieldset
        inputId="verificationCode"
        label="Verification Code"
        required={true}
        error={!!this.validationErrors.verificationCode}
        helpText={this.validationErrors.verificationCode}
      >
        <fui-input
          value={this.state?.verificationCode}
          onFuiInput={this.handleVerificationCodeChange}
          error={!!this.validationErrors.verificationCode}
          inputProps={{
            type: 'text',
            placeholder: '123456',
            required: true,
          }}
        />
      </fui-fieldset>
    );
  }

  private renderRecaptcha() {
    if (this.verificationSent) return null;

    return (
      <Fragment>
        <div class="mb-4" ref={el => (this.recaptchaContainer = el as HTMLDivElement)}></div>
        {!this.isRecaptchaVerified && <div class="text-sm text-gray-500">Please complete the reCAPTCHA verification to continue.</div>}
      </Fragment>
    );
  }

  render() {
    return (
      <div class="space-y-6">
        {this.renderPhoneNumberInput()}
        {this.renderVerificationCodeInput()}
        {this.renderRecaptcha()}
      </div>
    );
  }
}
