import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from 'src/app/types/product.type';
import { environment } from 'src/environments/environment';
import { CartService } from '../../services/cart.service';
import { CartType } from 'src/app/types/cart.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { FavoriteType } from 'src/app/types/favorite.type';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;

  constructor(
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.countInCart = this.count;
      });
  }

  updateCount(count: number): void {
    this.count = count;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.countInCart = 0;
        this.count = 1
      });
  }

  updateToFavorites(): void {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться');
      return;
    }

    if (this.product.isInFavorite) {
      this.favoriteService.removeFavorite(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            // .... 
            throw new Error(data.message);
          }

          this.product.isInFavorite = false;
        });
    } else {
      this.favoriteService.addFavorite(this.product.id)
        .subscribe((data: FavoriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.product.isInFavorite = true;
        });
    }
  }

  navigate(): void {
    if (this.isLight) {
      this.router.navigate(['/product/', this.product.url]);
    }
  }

}
