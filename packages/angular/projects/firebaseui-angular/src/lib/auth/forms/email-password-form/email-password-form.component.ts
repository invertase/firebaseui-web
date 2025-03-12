import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { FirebaseUi } from '../../../provider';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../../../components/button/button.component';
import { TermsAndPrivacyComponent } from '../../../components/terms-and-privacy/terms-and-privacy.component';
import {
  createEmailFormSchema,
  EmailFormSchema,
  FirebaseUIError,
  fuiSignInWithEmailAndPassword,
} from '@firebase-ui/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'fui-email-password-form',
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
      <fieldset>
        <ng-container [tanstackField]="form" name="password" #password="field">
          <label [for]="password.api.name">
            <span class="flex">
              <span class="flex-grow">{{ passwordLabel | async }}</span>
              <button
                type="button"
                (click)="navigateTo(forgotPasswordRoute)"
                class="fui-form__action"
              >
                {{ forgotPasswordLabel | async }}
              </button>
            </span>
            <input
              type="password"
              [id]="password.api.name"
              [name]="password.api.name"
              [value]="password.api.state.value"
              (blur)="password.api.handleBlur()"
              (input)="password.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="!!password.api.state.meta.errors.length"
            />
            <span
              role="alert"
              aria-live="polite"
              class="fui-form__error"
              *ngIf="!!password.api.state.meta.errors.length"
            >
              {{ password.api.state.meta.errors.join(', ') }}
            </span>
          </label>
        </ng-container>
      </fieldset>

      <fui-terms-and-privacy></fui-terms-and-privacy>

      <fieldset>
        <fui-button type="submit">
          {{ signInLabel | async }}
        </fui-button>
        <div class="fui-form__error" *ngIf="formError">{{ formError }}</div>
      </fieldset>

      <div class="flex justify-center items-center">
        <button
          type="button"
          (click)="navigateTo(registerRoute)"
          class="fui-form__action"
        >
          {{ noAccountLabel | async }} {{ registerLabel | async }}
        </button>
      </div>
    </form>
  `,
})
export class EmailPasswordFormComponent {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private router = inject(Router);
  private schema = this.ui
    .config()
    .pipe(map((config) => createEmailFormSchema(config?.translations)));

  @Input({ required: true }) forgotPasswordRoute!: string;
  @Input({ required: true }) registerRoute!: string;

  formError: string | null = null;

  form = injectForm<EmailFormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      this.formError = null;
      try {
        const config = await firstValueFrom(this.ui.config());

        await fuiSignInWithEmailAndPassword(
          this.auth,
          value.email,
          value.password,
          {
            translations: config?.translations,
            language: config?.language,
            enableAutoUpgradeAnonymous: config?.enableAutoUpgradeAnonymous,
            enableHandleExistingCredential:
              config?.enableHandleExistingCredential,
          }
        );
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
    },
  });

  constructor() {
    this.schema.subscribe((schema) => {
      this.form.update({
        validators: {
          onSubmit: schema,
          onBlur: schema,
        },
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

  get passwordLabel() {
    return this.ui.translation('labels', 'password');
  }

  get forgotPasswordLabel() {
    return this.ui.translation('labels', 'forgotPassword');
  }

  get signInLabel() {
    return this.ui.translation('labels', 'signIn');
  }

  get noAccountLabel() {
    return this.ui.translation('prompts', 'noAccount');
  }

  get registerLabel() {
    return this.ui.translation('labels', 'register');
  }
}
