import { Component, ContentChildren, inject, Input, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardSubtitleComponent } from '../../../components/card/card.component';
import { FirebaseUi } from '../../../provider';
import { EmailLinkFormComponent } from '../../forms/email-link-form/email-link-form.component';
import { DividerComponent } from '../../../components/divider/divider.component';

@Component({
  selector: 'fui-email-link-auth-screen',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    EmailLinkFormComponent,
    DividerComponent,
  ],
  template: `
    <div class="fui-screen">
      <fui-card>
        <fui-card-header>
          <fui-card-title>{{ titleText | async }}</fui-card-title>
          <fui-card-subtitle>{{ subtitleText | async }}</fui-card-subtitle>
        </fui-card-header>
        <fui-email-link-form [signInRoute]="signInRoute"></fui-email-link-form>
        
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
export class EmailLinkAuthScreenComponent {
  private ui = inject(FirebaseUi);

  @Input() signInRoute: string = '';
  @ContentChildren('*') content!: QueryList<any>;

  get hasContent(): boolean {
    return this.content && this.content.length > 0;
  }

  get titleText() {
    return this.ui.translation('labels', 'signIn');
  }

  get subtitleText() {
    return this.ui.translation('prompts', 'signInToAccount');
  }

  get dividerOrLabel() {
    return this.ui.translation('messages', 'dividerOr');
  }
}
