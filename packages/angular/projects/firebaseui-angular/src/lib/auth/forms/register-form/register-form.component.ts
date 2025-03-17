import { Component, inject, Input } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { FirebaseUi } from '../../../provider';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import {
  createEmailFormSchema,
  EmailFormSchema,
  FirebaseUIError,
  fuiCreateUserWithEmailAndPassword,
} from '@firebase-ui/core';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { TermsAndPrivacyComponent } from '../../../components/terms-and-privacy/terms-and-privacy.component';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'fui-register-form',
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
            <span>{{ passwordLabel | async }}</span>
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
          {{ createAccountLabel | async }}
        </fui-button>
        <div class="fui-form__error" *ngIf="formError">{{ formError }}</div>
      </fieldset>

      <div class="flex justify-center items-center" *ngIf="signInRoute">
        <button
          type="button"
          (click)="navigateTo(signInRoute)"
          class="fui-form__action"
        >
          {{ haveAccountLabel | async }} {{ signInLabel | async }} &rarr;
        </button>
      </div>
    </form>
  `,
})
export class RegisterFormComponent {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private router = inject(Router);
  private schema = this.ui
    .config()
    .pipe(map((config) => createEmailFormSchema(config.translations)));

  @Input({ required: true }) signInRoute!: string;

  formError: string | null = null;

  form = injectForm<EmailFormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      console.log('value', value);
      this.formError = null;
      try {
        // Using firstValueFrom to get config
        const config = await firstValueFrom(this.ui.config());

        await fuiCreateUserWithEmailAndPassword(
          this.auth,
          value.email,
          value.password,
          {
            translations: config?.translations,
            language: config?.language,
            enableAutoUpgradeAnonymous: config?.enableAutoUpgradeAnonymous,
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
    // Subscribe to schema changes and update form validators
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

  get createAccountLabel() {
    return this.ui.translation('labels', 'createAccount');
  }

  get haveAccountLabel() {
    return this.ui.translation('prompts', 'haveAccount');
  }

  get signInLabel() {
    return this.ui.translation('labels', 'signIn');
  }
}
