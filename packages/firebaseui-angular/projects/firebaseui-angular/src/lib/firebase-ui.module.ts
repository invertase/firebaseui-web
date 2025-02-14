import { NgModule } from '@angular/core';
import { ButtonComponent, ButtonDirective } from './button/button.component';

@NgModule({
  imports: [ButtonComponent, ButtonDirective],
  exports: [ButtonComponent, ButtonDirective]
})
export class FirebaseUIModule {} 