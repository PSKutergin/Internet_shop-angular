import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CategoryType } from 'src/app/types/category.type';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  categories: CategoryType[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => this.categories = categories);
  }

}
