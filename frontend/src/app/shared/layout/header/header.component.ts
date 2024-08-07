import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';
import { CartService } from '../../services/cart.service';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { ProductService } from '../../services/product.service';
import { ProductType } from 'src/app/types/product.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showedSearch: boolean = false;
  searchValue: string = '';
  count: number = 0;
  isLogged: boolean = false;
  products: ProductType[] = [];
  @Input() categories: CategoryWithTypeType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
    })

    this.cartService.getCountCart()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.count = (data as { count: number }).count
      })

    this.cartService.count$
      .subscribe((count: number) => {
        this.count = count
      })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из аккаунта');
    this.router.navigate(['/']);
  }

  changeSearchValue(newValue: string): void {
    this.searchValue = newValue;

    if (this.searchValue && this.searchValue.length > 2) {
      this.productService.searchProducts(this.searchValue)
        .subscribe((data: ProductType[]) => {
          this.products = data;
          this.showedSearch = true;
        })
    } else {
      this.products = [];
    }
  }

  selectProduct(url: string): void {
    this.router.navigate(['/product/' + url]);
    this.searchValue = '';
    this.products = [];
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }

}
