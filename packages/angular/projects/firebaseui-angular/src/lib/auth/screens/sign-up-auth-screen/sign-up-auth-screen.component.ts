import { Component, ContentChildren, EventEmitter, inject, Input, Output, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardSubtitleComponent } from '../../../components/card/card.component';

import { FirebaseUi } from '../../../provider';
import { RegisterFormComponent } from '../../forms/register-form/register-form.component';
import { DividerComponent } from '../../../components/divider/divider.component';

@Component({
  selector: 'fui-sign-up-auth-screen',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    RegisterFormComponent,
    DividerComponent,
  ],
  template: `
    <div class="fui-screen">
      <fui-card>
        <fui-card-header>
          <fui-card-title>{{ titleText | async }}</fui-card-title>
          <fui-card-subtitle>{{ subtitleText | async }}</fui-card-subtitle>
        </fui-card-header>
        <fui-register-form
          [showBackToSignIn]="true"
          [signInRoute]="signInRoute"
          (onBackToSignInClick)="onBackToSignInClick.emit()"
        ></fui-register-form>
        
        <ng-container *ngIf="hasContent">
          <fui-divider>{{ dividerOrLabel | async }}</fui-divider>
          <div class="space-y-4">
            <ng-content></ng-content>
          </div>
        </ng-container>
      </fui-card>
    </div>
  `
})
export class SignUpAuthScreenComponent {
  private ui = inject(FirebaseUi);

  @Input() signInRoute: string = '';
  @Output() onBackToSignInClick = new EventEmitter<void>();
  @ContentChildren('*') content!: QueryList<any>;

  get hasContent(): boolean {
    return this.content && this.content.length > 0;
  }

  get titleText() {
    return this.ui.translation('labels', 'register');
  }

  get subtitleText() {
    return this.ui.translation('prompts', 'enterDetailsToCreate');
  }

  get dividerOrLabel() {
    return this.ui.translation('messages', 'dividerOr');
  }
}
