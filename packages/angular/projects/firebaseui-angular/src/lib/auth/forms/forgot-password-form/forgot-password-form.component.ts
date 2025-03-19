import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { FirebaseUi } from '../../../provider';
import { Auth } from '@angular/fire/auth';
import { ButtonComponent } from '../../../components/button/button.component';
import { TermsAndPrivacyComponent } from '../../../components/terms-and-privacy/terms-and-privacy.component';
import {
  createForgotPasswordFormSchema,
  FirebaseUIError,
  ForgotPasswordFormSchema,
  fuiSendPasswordResetEmail,
} from '@firebase-ui/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'fui-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    TanStackField,
    ButtonComponent,
    TermsAndPrivacyComponent,
  ],
  template: `
    <div *ngIf="emailSent" class="fui-form__success">
      {{ checkEmailForResetMessage | async }}
    </div>
    <form *ngIf="!emailSent" (submit)="handleSubmit($event)" class="fui-form">
      <fieldset>
        <ng-container [tanstackField]="form" name="email" #email="field">
          <label [for]="email.api.name">
            <span>{{ emailLabel | async }}</span>
            <input
              type="email"
              [id]="email.api.name"
              [name]="email.api.name"
              [value]="email.api.state.value"
              (blur)="email.api.handleBlur()"
              (input)="email.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="!!email.api.state.meta.errors.length"
            />
            <span
              role="alert"
              aria-live="polite"
              class="fui-form__error"
              *ngIf="!!email.api.state.meta.errors.length"
            >
              {{ email.api.state.meta.errors.join(', ') }}
            </span>
          </label>
        </ng-container>
      </fieldset>

      <fui-terms-and-privacy></fui-terms-and-privacy>

      <fieldset>
        <fui-button type="submit">
          {{ resetPasswordLabel | async }}
        </fui-button>
        <div class="fui-form__error" *ngIf="formError">{{ formError }}</div>
      </fieldset>

      <div class="flex justify-center items-center" *ngIf="signInRoute">
        <button
          type="button"
          (click)="navigateTo(signInRoute)"
          class="fui-form__action"
        >
          {{ backToSignInLabel | async }} &rarr;
        </button>
      </div>
    </form>
  `,
})
export class ForgotPasswordFormComponent implements OnInit {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private router = inject(Router);

  @Input({ required: true }) signInRoute!: string;

  formError: string | null = null;
  emailSent = false;
  private formSchema: any;
  private config: any;

  form = injectForm<ForgotPasswordFormSchema>({
    defaultValues: {
      email: '',
    },
    // Removed onSubmit callback
  });

  async ngOnInit() {
    try {
      this.config = await firstValueFrom(this.ui.config());

      this.formSchema = createForgotPasswordFormSchema(
        this.config?.translations
      );

      this.form.update({
        validators: {
          onSubmit: this.formSchema,
          onBlur: this.formSchema,
        },
      });
    } catch (error) {
      this.formError = await firstValueFrom(
        this.ui.translation('errors', 'unknownError')
      );
    }
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

    const email = this.form.state.values.email;

    if (!email) {
      return;
    }

    this.resetPassword(email);
  }

  async resetPassword(email: string) {
    this.formError = null;

    try {
      const validationResult = this.formSchema.safeParse({
        email,
      });

      if (!validationResult.success) {
        const validationErrors = validationResult.error.format();

        if (validationErrors.email?._errors?.length) {
          this.formError = validationErrors.email._errors[0];
          return;
        }

        this.formError = await firstValueFrom(
          this.ui.translation('errors', 'unknownError')
        );
        return;
      }

      // Send password reset email
      await fuiSendPasswordResetEmail(this.auth, email, {
        translations: this.config?.translations,
        language: this.config?.language,
      });

      this.emailSent = true;
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        this.formError = error.message;
        return;
      }

      this.formError = await firstValueFrom(
        this.ui.translation('errors', 'unknownError')
      );
    }
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  get emailLabel() {
    return this.ui.translation('labels', 'emailAddress');
  }

  get resetPasswordLabel() {
    return this.ui.translation('labels', 'resetPassword');
  }

  get backToSignInLabel() {
    return this.ui.translation('labels', 'backToSignIn');
  }

  get checkEmailForResetMessage() {
    return this.ui.translation('messages', 'checkEmailForReset');
  }
}
