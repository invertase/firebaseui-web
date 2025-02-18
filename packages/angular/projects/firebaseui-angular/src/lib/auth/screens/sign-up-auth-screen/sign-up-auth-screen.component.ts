import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardSubtitleComponent } from '../../../components/card/card.component';
import { DividerComponent } from '../../../components/divider/divider.component';

@Component({
  selector: 'fui-sign-up-auth-screen',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    DividerComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubtitleComponent,
  ],
  template: `
    <div class="fui-screen">
      <fui-card>
        <fui-card-header>
          <fui-card-title>TODO</fui-card-title>
          <fui-card-subtitle>TODO DESC</fui-card-subtitle>
        </fui-card-header>
        <!-- <fui-register-form (backToSignInClick)="onBackToSignInClick.emit()"></fui-register-form> -->
        <ng-container *ngIf="hasContent">
          <fui-divider>
           TODO: Add divider
          </fui-divider>
          <div class="space-y-4">
            <ng-content></ng-content>
          </div>
        </ng-container>
      </fui-card>
    </div>
  `
})
export class SignUpAuthScreenComponent {
  @Output() onBackToSignInClick = new EventEmitter<void>();

  // titleText: string;
  // subtitleText: string;
  translations: any;
  // language: string;

  get hasContent(): boolean {
    // const element = this.elementRef.nativeElement;
    // return element.childNodes.length > 0;
    return false;
  }

  // constructor(
  //   private configService: ConfigService,
  //   private elementRef: ElementRef
  // ) {
  //   this.language = this.configService.language;
  //   this.translations = this.configService.translations;

  //   this.titleText = getTranslation(
  //     'labels',
  //     'register',
  //     this.translations,
  //     this.language
  //   );
    
  //   this.subtitleText = getTranslation(
  //     'prompts',
  //     'enterDetailsToCreate',
  //     this.translations,
  //     this.language
  //   );
  // }
}
