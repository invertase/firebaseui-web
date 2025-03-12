import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { FirebaseUi } from '../../../provider';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../../../components/button/button.component';
import { TermsAndPrivacyComponent } from '../../../components/terms-and-privacy/terms-and-privacy.component';
import { createForgotPasswordFormSchema, FirebaseUIError, ForgotPasswordFormSchema, fuiSendPasswordResetEmail } from '@firebase-ui/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'fui-forgot-password-form',
  standalone: true,
  imports: [CommonModule, TanStackField, ButtonComponent, TermsAndPrivacyComponent],
  template: `
    <div *ngIf="emailSent" class="fui-form__success">
      {{ checkEmailForResetMessage | async }}
    </div>
    <form *ngIf="!emailSent" (submit)="handleSubmit($event)" class="fui-form">
      <fieldset>
        <ng-container
          [tanstackField]="form"
          name="email"
          #email="field"
        >
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

      <div class="flex justify-center items-center" *ngIf="showBackToSignIn">
        <button
          type="button"
          (click)="navigateTo(signInRoute)"
          class="fui-form__action"
        >
          {{ backToSignInLabel | async }} &rarr;
        </button>
      </div>
    </form>
  `
})
export class ForgotPasswordFormComponent {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private router = inject(Router);
  private schema = this.ui.config().pipe(
    map(config => createForgotPasswordFormSchema(config?.translations))
  );

  @Input({ required: true }) signInRoute!: string;
  showBackToSignIn = true;

  formError: string | null = null;
  emailSent = false;

  form = injectForm<ForgotPasswordFormSchema>({
    defaultValues: {
      email: ''
    },
    onSubmit: async ({ value }) => {
      this.formError = null;
      try {
        const config = await firstValueFrom(this.ui.config());
        
        await fuiSendPasswordResetEmail(
          this.auth, 
          value.email, 
          {
            translations: config?.translations,
            language: config?.language
          }
        );
        this.emailSent = true;
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          this.formError = error.message;
          return;
        }

        console.error(error);
        this.formError = await firstValueFrom(this.ui.translation('errors', 'unknownError'));
      }
    }
  });

  constructor() {
    this.schema.subscribe(schema => {
      this.form.update({
        validators: {
          onSubmit: schema,
          onBlur: schema
        }
      });
    });
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
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
