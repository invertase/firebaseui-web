import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { FirebaseUi } from '../../../provider';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../../../components/button/button.component';
import { TermsAndPrivacyComponent } from '../../../components/terms-and-privacy/terms-and-privacy.component';
import { createEmailLinkFormSchema, FirebaseUIError, fuiCompleteEmailLinkSignIn, fuiSendSignInLinkToEmail } from '@firebase-ui/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'fui-email-link-form',
  standalone: true,
  imports: [CommonModule, TanStackField, ButtonComponent, TermsAndPrivacyComponent],
  template: `
    <div *ngIf="emailSent" class="fui-form">
      {{ emailSentMessage | async }}
      
      <div class="flex justify-center items-center mt-4" *ngIf="signInRoute">
        <button
          type="button"
          (click)="navigateTo(signInRoute)"
          class="fui-form__action"
        >
          {{ backToSignInLabel | async }} &rarr;
        </button>
      </div>
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
          {{ sendSignInLinkLabel | async }}
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
  `
})
export class EmailLinkFormComponent implements OnInit {
  private ui = inject(FirebaseUi);
  private router = inject(Router);
  private auth = inject(Auth);
  private schema = this.ui.config().pipe(
    map(config => createEmailLinkFormSchema(config?.translations))
  );

  @Input() signInRoute: string = '';

  formError: string | null = null;
  emailSent = false;

  form = injectForm({
    defaultValues: {
      email: ''
    },
    onSubmit: async ({ value }) => {
      this.formError = null;
      try {
        const config = await firstValueFrom(this.ui.config());
        
        await fuiSendSignInLinkToEmail(
          this.auth, 
          value.email, 
          {
            translations: config?.translations,
            language: config?.language,
            enableAutoUpgradeAnonymous: config?.enableAutoUpgradeAnonymous
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

  ngOnInit() {
    // Handle email link sign-in if URL contains the link
    this.completeSignIn();
  }

  private async completeSignIn() {
    try {
      const config = await firstValueFrom(this.ui.config());
      
      await fuiCompleteEmailLinkSignIn(
        this.auth, 
        window.location.href, 
        {
          translations: config?.translations,
          language: config?.language,
          enableAutoUpgradeAnonymous: config?.enableAutoUpgradeAnonymous,
          enableHandleExistingCredential: config?.enableHandleExistingCredential
        }
      );
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        this.formError = error.message;
      }
    }
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }

  get emailLabel() {
    return this.ui.translation('labels', 'emailAddress');
  }

  get sendSignInLinkLabel() {
    return this.ui.translation('labels', 'sendSignInLink');
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  get backToSignInLabel() {
    return this.ui.translation('labels', 'signIn');
  }

  get emailSentMessage() {
    return this.ui.translation('messages', 'signInLinkSent');
  }
}
