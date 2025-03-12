import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { FirebaseUi } from '../../../provider';
import {
  Auth,
  ConfirmationResult,
  RecaptchaVerifier,
} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../../../components/button/button.component';
import { TermsAndPrivacyComponent } from '../../../components/terms-and-privacy/terms-and-privacy.component';
import { CountrySelectorComponent } from '../../../components/country-selector/country-selector.component';
import {
  CountryData,
  countryData,
  createPhoneFormSchema,
  FirebaseUIError,
  formatPhoneNumberWithCountry,
  fuiConfirmPhoneNumber,
  fuiSignInWithPhoneNumber,
} from '@firebase-ui/core';
import { interval, Subscription, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { z } from 'zod';

@Component({
  selector: 'fui-phone-number-form',
  standalone: true,
  imports: [
    CommonModule,
    TanStackField,
    ButtonComponent,
    TermsAndPrivacyComponent,
    CountrySelectorComponent,
  ],
  template: `
    <form (submit)="handleSubmit($event)" class="fui-form">
      <fieldset>
        <ng-container
          [tanstackField]="form"
          name="phoneNumber"
          #phoneNumber="field"
        >
          <label [for]="phoneNumber.api.name">
            <span>{{ phoneNumberLabel | async }}</span>
            <div class="fui-phone-input">
              <fui-country-selector
                [value]="selectedCountry"
                (onChange)="handleCountryChange($event)"
                className="fui-phone-input__country-selector"
              ></fui-country-selector>
              <input
                type="tel"
                [id]="phoneNumber.api.name"
                [name]="phoneNumber.api.name"
                [value]="phoneNumber.api.state.value"
                (blur)="phoneNumber.api.handleBlur()"
                (input)="
                  phoneNumber.api.handleChange($any($event).target.value)
                "
                [attr.aria-invalid]="!!phoneNumber.api.state.meta.errors.length"
                class="fui-phone-input__number-input"
              />
            </div>
            <span
              role="alert"
              aria-live="polite"
              class="fui-form__error"
              *ngIf="!!phoneNumber.api.state.meta.errors.length"
            >
              {{ phoneNumber.api.state.meta.errors.join(', ') }}
            </span>
          </label>
        </ng-container>
      </fieldset>

      <fieldset>
        <div class="fui-recaptcha-container" #recaptchaContainer></div>
      </fieldset>

      <fui-terms-and-privacy></fui-terms-and-privacy>

      <fieldset>
        <fui-button type="submit" [disabled]="!recaptchaVerifier">
          {{ sendCodeLabel | async }}
        </fui-button>
        <div class="fui-form__error" *ngIf="formError">{{ formError }}</div>
      </fieldset>
    </form>
  `,
})
export class PhoneNumberFormComponent implements OnInit, OnDestroy {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private schema = this.ui
    .config()
    .pipe(
      map((config) =>
        createPhoneFormSchema(config?.translations).pick({ phoneNumber: true })
      )
    );

  @Input() onSubmit!: (phoneNumber: string) => Promise<void>;
  @Input() formError: string | null = null;
  @Input() showTerms = true;
  @ViewChild('recaptchaContainer', { static: true })
  recaptchaContainer!: ElementRef<HTMLDivElement>;

  recaptchaVerifier: RecaptchaVerifier | null = null;
  selectedCountry: CountryData = countryData[0];

  form = injectForm<z.infer<z.ZodObject<{ phoneNumber: z.ZodString }>>>({
    defaultValues: {
      phoneNumber: '',
    },
    onSubmit: async ({ value }) => {
      const formattedNumber = formatPhoneNumberWithCountry(
        value.phoneNumber,
        this.selectedCountry.dialCode
      );
      await this.onSubmit(formattedNumber);
    },
  });

  ngOnInit() {
    this.schema.subscribe((schema) => {
      this.form.update({
        validators: {
          onSubmit: schema,
          onBlur: schema,
        },
      });
    });

    this.initRecaptcha();
  }

  ngOnDestroy() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  async initRecaptcha() {
    const config = await firstValueFrom(this.ui.config());
    const verifier = new RecaptchaVerifier(
      this.auth,
      this.recaptchaContainer.nativeElement,
      {
        size: config?.recaptchaMode ?? 'normal',
      }
    );
    this.recaptchaVerifier = verifier;
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }

  handleCountryChange(country: CountryData) {
    this.selectedCountry = country;
  }

  get phoneNumberLabel() {
    return this.ui.translation('labels', 'phoneNumber');
  }

  get sendCodeLabel() {
    return this.ui.translation('labels', 'sendCode');
  }
}

@Component({
  selector: 'fui-verification-form',
  standalone: true,
  imports: [
    CommonModule,
    TanStackField,
    ButtonComponent,
    TermsAndPrivacyComponent,
  ],
  template: `
    <form (submit)="handleSubmit($event)" class="fui-form">
      <fieldset>
        <ng-container
          [tanstackField]="form"
          name="verificationCode"
          #verificationCode="field"
        >
          <label [for]="verificationCode.api.name">
            <span>{{ verificationCodeLabel | async }}</span>
            <input
              type="text"
              [id]="verificationCode.api.name"
              [name]="verificationCode.api.name"
              [value]="verificationCode.api.state.value"
              (blur)="verificationCode.api.handleBlur()"
              (input)="
                verificationCode.api.handleChange($any($event).target.value)
              "
              [attr.aria-invalid]="
                !!verificationCode.api.state.meta.errors.length
              "
            />
            <span
              role="alert"
              aria-live="polite"
              class="fui-form__error"
              *ngIf="!!verificationCode.api.state.meta.errors.length"
            >
              {{ verificationCode.api.state.meta.errors.join(', ') }}
            </span>
          </label>
        </ng-container>
      </fieldset>

      <fieldset>
        <div class="fui-recaptcha-container" #recaptchaContainer></div>
      </fieldset>

      <ng-container *ngIf="showTerms">
        <fui-terms-and-privacy></fui-terms-and-privacy>
      </ng-container>

      <fieldset>
        <fui-button type="submit">
          {{ verifyCodeLabel | async }}
        </fui-button>
        <fui-button
          type="button"
          (click)="onResend()"
          [disabled]="isResending || !canResend"
          variant="secondary"
        >
          <ng-container *ngIf="isResending">
            {{ sendingLabel | async }}
          </ng-container>
          <ng-container *ngIf="!isResending && !canResend">
            {{ resendCodeLabel | async }} ({{ timeLeft }}s)
          </ng-container>
          <ng-container *ngIf="!isResending && canResend">
            {{ resendCodeLabel | async }}
          </ng-container>
        </fui-button>
        <div class="fui-form__error" *ngIf="formError">{{ formError }}</div>
      </fieldset>
    </form>
  `,
})
export class VerificationFormComponent implements OnInit, OnDestroy {
  private ui = inject(FirebaseUi);
  private schema = this.ui.config().pipe(
    map((config) =>
      createPhoneFormSchema(config?.translations).pick({
        verificationCode: true,
      })
    )
  );

  @Input() onSubmit!: (code: string) => Promise<void>;
  @Input() onResend!: () => Promise<void>;
  @Input() formError: string | null = null;
  @Input() showTerms = false;
  @Input() isResending = false;
  @Input() canResend = false;
  @Input() timeLeft = 0;
  @ViewChild('recaptchaContainer', { static: true })
  recaptchaContainer!: ElementRef<HTMLDivElement>;

  form = injectForm<z.infer<z.ZodObject<{ verificationCode: z.ZodString }>>>({
    defaultValues: {
      verificationCode: '',
    },
    onSubmit: async ({ value }) => {
      await this.onSubmit(value.verificationCode);
    },
  });

  ngOnInit() {
    this.schema.subscribe((schema) => {
      this.form.update({
        validators: {
          onSubmit: schema,
          onBlur: schema,
        },
      });
    });
  }

  ngOnDestroy() {}

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }

  get verificationCodeLabel() {
    return this.ui.translation('labels', 'verificationCode');
  }

  get verifyCodeLabel() {
    return this.ui.translation('labels', 'verifyCode');
  }

  get resendCodeLabel() {
    return this.ui.translation('labels', 'resendCode');
  }

  get sendingLabel() {
    return this.ui.translation('labels', 'sending');
  }
}

@Component({
  selector: 'fui-phone-form',
  standalone: true,
  imports: [CommonModule, PhoneNumberFormComponent, VerificationFormComponent],
  template: `
    <div class="fui-form-container">
      <ng-container *ngIf="confirmationResult; else phoneNumberForm">
        <fui-verification-form
          [onSubmit]="handleVerificationSubmit.bind(this)"
          [onResend]="handleResend.bind(this)"
          [formError]="formError"
          [showTerms]="false"
          [isResending]="isResending"
          [canResend]="canResend"
          [timeLeft]="timeLeft"
        ></fui-verification-form>
        
        <div class="flex justify-center items-center mt-4" *ngIf="signInRoute">
          <button
            type="button"
            (click)="navigateTo(signInRoute)"
            class="fui-form__action"
          >
            {{ backToSignInLabel | async }} &rarr;
          </button>
        </div>
      </ng-container>
      <ng-template #phoneNumberForm>
        <fui-phone-number-form
          [onSubmit]="handlePhoneSubmit.bind(this)"
          [formError]="formError"
          [showTerms]="true"
        ></fui-phone-number-form>
        
        <div class="flex justify-center items-center mt-4" *ngIf="signInRoute">
          <button
            type="button"
            (click)="navigateTo(signInRoute)"
            class="fui-form__action"
          >
            {{ backToSignInLabel | async }} &rarr;
          </button>
        </div>
      </ng-template>
    </div>
  `,
})
export class PhoneFormComponent implements OnInit, OnDestroy {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private router = inject(Router);

  @Input() resendDelay = 30;
  @Input() signInRoute: string = '';

  formError: string | null = null;
  confirmationResult: ConfirmationResult | null = null;
  recaptchaVerifier: RecaptchaVerifier | null = null;
  phoneNumber = '';
  isResending = false;
  timeLeft = 0;
  canResend = false;
  timerSubscription: Subscription | null = null;

  ngOnInit() {}

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  async handlePhoneSubmit(number: string): Promise<void> {
    this.formError = null;
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('ReCAPTCHA not initialized');
      }

      const config = await firstValueFrom(this.ui.config());

      const result = await fuiSignInWithPhoneNumber(
        this.auth,
        number,
        this.recaptchaVerifier,
        {
          translations: config?.translations,
          language: config?.language,
        }
      );

      this.phoneNumber = number;
      this.confirmationResult = result;
      this.startTimer();
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        this.formError = error.message;
        return;
      }
      console.error(error);
      this.formError = await firstValueFrom(
        this.ui.translation('errors', 'unknownError')
      );
    }
  }

  async handleResend(): Promise<void> {
    if (this.isResending || !this.canResend || !this.phoneNumber) {
      return;
    }

    this.isResending = true;
    this.formError = null;

    try {
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }

      const config = await firstValueFrom(this.ui.config());

      // We need to get the recaptcha container from the verification form
      // This is a bit hacky, but it works for now
      const recaptchaContainer = document.querySelector(
        '.fui-recaptcha-container'
      ) as HTMLDivElement;
      if (!recaptchaContainer) {
        throw new Error('ReCAPTCHA container not found');
      }

      const verifier = new RecaptchaVerifier(this.auth, recaptchaContainer, {
        size: config?.recaptchaMode ?? 'normal',
      });
      this.recaptchaVerifier = verifier;

      const result = await fuiSignInWithPhoneNumber(
        this.auth,
        this.phoneNumber,
        verifier,
        {
          translations: config?.translations,
          language: config?.language,
        }
      );

      this.confirmationResult = result;
      this.startTimer();
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        this.formError = error.message;
      } else {
        console.error(error);
        this.ui.translation('errors', 'unknownError').subscribe((message) => {
          this.formError = message;
        });
      }
    } finally {
      this.isResending = false;
    }
  }

  async handleVerificationSubmit(code: string): Promise<void> {
    if (!this.confirmationResult) {
      throw new Error('Confirmation result not initialized');
    }

    this.formError = null;

    try {
      const config = await firstValueFrom(this.ui.config());

      await fuiConfirmPhoneNumber(this.confirmationResult, code, {
        translations: config?.translations,
        language: config?.language,
        enableAutoUpgradeAnonymous: config?.enableAutoUpgradeAnonymous,
        enableHandleExistingCredential: config?.enableHandleExistingCredential,
      });
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        this.formError = error.message;
        return;
      }
      console.error(error);
      this.formError = await firstValueFrom(
        this.ui.translation('errors', 'unknownError')
      );
    }
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  get backToSignInLabel() {
    return this.ui.translation('labels', 'signIn');
  }

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timeLeft = this.resendDelay;
    this.canResend = false;

    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.canResend = true;
          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
        }
      });
  }
}
