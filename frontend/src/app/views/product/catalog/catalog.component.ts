import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';
import { ProductType } from 'src/app/types/product.type';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe((data: { totalCount: number, pages: number, items: ProductType[] }) => this.products = data.items);

    this.categoryService.getCategoriesWithTypes()
      .subscribe((data: CategoryWithTypeType[]) => this.categoriesWithTypes = data);
  }

}
