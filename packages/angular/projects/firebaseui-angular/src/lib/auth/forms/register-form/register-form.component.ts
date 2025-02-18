import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { FirebaseUi } from '../../../provider';
import { CommonModule } from '@angular/common';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { createEmailFormSchema, EmailFormSchema, fuiCreateUserWithEmailAndPassword } from '@firebase-ui/core';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'fui-register-form',
  imports: [CommonModule, TanStackField, ButtonComponent],
  template: `
    <form (submit)="handleSubmit($event)" class="fui-form">
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
      <fieldset>
        <ng-container
          [tanstackField]="form"
          name="password"
          #password="field"
        >
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
      <fieldset>
        <fui-button type="submit">
          {{ createAccountLabel | async }}
        </fui-button>
      </fieldset>
    </form>
  `
})
export class RegisterFormComponent {
  private ui = inject(FirebaseUi);
  private auth = inject(Auth);
  private schema = this.ui.config().pipe(
    map(config => createEmailFormSchema(config.translations))
  );

  form = injectForm<EmailFormSchema>({
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      await fuiCreateUserWithEmailAndPassword(this.auth, value.email, value.password);
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
    event.preventDefault()
    event.stopPropagation()
    this.form.handleSubmit()
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
}