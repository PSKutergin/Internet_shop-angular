import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  categories: CategoryWithTypeType[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithTypeType[]) => this.categories = categories.map((item) => {
        return { typesUrl: item.types.map((type) => type.url), ...item }
      }));
  }

}
