import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRepeatDirective } from './directives/password-repeat.directive';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { CountSelectorComponent } from './components/count-selector/count-selector.component';

@NgModule({
  declarations: [PasswordRepeatDirective, ProductCardComponent, CategoryFilterComponent, CountSelectorComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [PasswordRepeatDirective, ProductCardComponent, CategoryFilterComponent, CountSelectorComponent]
})
export class SharedModule { }
