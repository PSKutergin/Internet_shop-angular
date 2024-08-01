import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/app/types/active-params.type';
import { AppliedFilterType } from 'src/app/types/applied-filter.type';
import { CartType } from 'src/app/types/cart.type';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { FavoriteType } from 'src/app/types/favorite.type';
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
  ];
  pages: number[] = [];
  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] | null = null;

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.cart = data as CartType;

        if (this.authService.getIsLoggedIn()) {
          this.favoriteService.getFavorites()
            .subscribe(
              {
                next: (data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error = (data as DefaultResponseType).message;
                    this.processCatalog();
                    throw new Error(error);
                  }

                  this.favoriteProducts = data as FavoriteType[];
                  this.processCatalog();
                },
                error: (error) => {
                  this.processCatalog();
                },
              }
            )
        } else {
          this.processCatalog();
        }
      });
  }

  processCatalog(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((data: CategoryWithTypeType[]) => {
        this.categoriesWithTypes = data

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe((params) => {
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

            this.productService.getProducts(this.activeParams)
              .subscribe((data: { totalCount: number, pages: number, items: ProductType[] }) => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                if (this.cart && this.cart.items.length > 0) {
                  this.products = data.items.map((product) => {
                    if (this.cart) {
                      const cartItem = this.cart.items.find((item) => item.product.id === product.id);
                      if (cartItem) {
                        product.countInCart = cartItem.quantity;
                      }
                    }
                    return product;
                  });
                } else {
                  this.products = data.items;
                }

                if (this.favoriteProducts) {
                  this.products = this.products.map((product) => {
                    if (this.favoriteProducts) {
                      const favoriteItem = this.favoriteProducts.find((item) => item.id === product.id);
                      if (favoriteItem) {
                        product.isInFavorite = true;
                      }
                    }
                    return product;
                  });
                }
              });
          });
      });
  }

  removeAppliedFilter(filter: AppliedFilterType): void {
    if (filter.urlParam === 'heightFrom' || filter.urlParam === 'diameterFrom' || filter.urlParam === 'heightTo' || filter.urlParam === 'diameterTo') {
      delete this.activeParams[filter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter((type) => type !== filter.urlParam);
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], { queryParams: this.activeParams });
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(sorting: string): void {
    this.activeParams.sort = sorting;
    this.router.navigate(['/catalog'], { queryParams: this.activeParams });
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], { queryParams: this.activeParams });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], { queryParams: this.activeParams });
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], { queryParams: this.activeParams });
    }
  }
}
