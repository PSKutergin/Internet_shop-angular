import { Component, OnInit } from '@angular/core';
import { CategoryType } from 'src/app/types/category.type';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  categories: CategoryType[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => this.categories = categories);
  }

}
