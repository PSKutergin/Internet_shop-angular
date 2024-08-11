import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartType } from 'src/app/types/cart.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { FavoriteType } from 'src/app/types/favorite.type';
import { ProductType } from 'src/app/types/product.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  count: number = 1;
  products: ProductType[] = [];
  product!: ProductType;
  serverStaticPath = environment.serverStaticPath
  isLogged: boolean = false;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();

    this.activatedRoute.params.subscribe((params) => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          this.product = data;

          this.cartService.getCart()
            .subscribe((cartData: CartType | DefaultResponseType) => {
              if ((cartData as DefaultResponseType).error !== undefined) {
                throw new Error((cartData as DefaultResponseType).message);
              }

              const cartDataResponse = cartData as CartType;

              if (cartDataResponse) {
                const productInCart = cartDataResponse.items.find((item) => item.product.id === data.id);
                if (productInCart) {
                  this.product.countInCart = productInCart.quantity;
                  this.count = this.product.countInCart;
                }
              }
            });

          if (this.authService.getIsLoggedIn()) {
            this.favoriteService.getFavorites()
              .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }

                const favorites = data as FavoriteType[];
                const productInFavorites = favorites.find((item) => item.id === this.product.id);

                if (productInFavorites) {
                  this.product.isInFavorite = true;
                }
              });
          }
        })
    })

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => this.products = data);
  }

  updateCount(count: number): void {
    this.count = count;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.countInCart = this.count;
        });
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.product.countInCart = this.count;
      });
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.product.countInCart = 0;
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
}
