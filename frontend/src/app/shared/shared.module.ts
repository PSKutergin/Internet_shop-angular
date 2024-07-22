import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRepeatDirective } from './directives/password-repeat.directive';

@NgModule({
  declarations: [PasswordRepeatDirective],
  imports: [
    CommonModule
  ],
  exports: [PasswordRepeatDirective]
})
export class SharedModule { }
