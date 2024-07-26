import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/app/types/active-params.type';
import { AppliedFilterType } from 'src/app/types/applied-filter.type';
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
  activeParams: ActiveParamsType = { types: [] };
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen: boolean = false;
  sortingOptions: { name: string, value: string }[] = [
    { name: 'От А до Я', value: 'az-asc' },
    { name: 'От Я до А', value: 'az-desc' },
    { name: 'По возрастанию цены', value: 'price-asc' },
    { name: 'По убыванию цены', value: 'price-desc' }
  ]

  constructor(private productService: ProductService, private categoryService: CategoryService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe((data: { totalCount: number, pages: number, items: ProductType[] }) => {
        this.products = data.items

        this.activatedRoute.queryParams.subscribe((params) => {
          this.activeParams = ActiveParamsUtil.processParams(params as ActiveParamsType);

          this.appliedFilters = [];
          this.activeParams.types.forEach((url) => {
            for (let i = 0; i < this.categoriesWithTypes.length; i++) {
              const foundType = this.categoriesWithTypes[i].types.find((type) => type.url === url);
              if (foundType) {
                this.appliedFilters.push({
                  name: foundType.name,
                  urlParam: foundType.url
                });
              }
            }
          });

          if (this.activeParams.heightFrom) this.appliedFilters.push({
            name: 'Высота от ' + this.activeParams.heightFrom + ' см',
            urlParam: 'heightFrom'
          });

          if (this.activeParams.heightTo) this.appliedFilters.push({
            name: 'Высота до ' + this.activeParams.heightTo + ' см',
            urlParam: 'heightTo'
          });

          if (this.activeParams.diameterFrom) this.appliedFilters.push({
            name: 'Диаметр от ' + this.activeParams.diameterFrom + ' см',
            urlParam: 'diameterFrom'
          });

          if (this.activeParams.diameterTo) this.appliedFilters.push({
            name: 'Диаметр до ' + this.activeParams.diameterTo + ' см',
            urlParam: 'diameterTo'
          });
        });
      });

    this.categoryService.getCategoriesWithTypes()
      .subscribe((data: CategoryWithTypeType[]) => this.categoriesWithTypes = data);
  }

  removeAppliedFilter(filter: AppliedFilterType): void {
    if (filter.urlParam === 'heightFrom' || filter.urlParam === 'diameterFrom' || filter.urlParam === 'heightTo' || filter.urlParam === 'diameterTo') {
      delete this.activeParams[filter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter((type) => type !== filter.urlParam);
    }

    this.router.navigate(['/catalog'], { queryParams: this.activeParams });
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(sorting: string): void {
    this.activeParams.sort = sorting;
    this.router.navigate(['/catalog'], { queryParams: this.activeParams });
  }
}
