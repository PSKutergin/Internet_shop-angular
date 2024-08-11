import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { CartType } from 'src/app/types/cart.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { FavoriteType } from 'src/app/types/favorite.type';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  favorites: FavoriteType[] = [];

  constructor(private cartService: CartService, private favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.favorites = data as FavoriteType[]

        this.processFavorite();
      });
  }

  processFavorite(): void {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const cart = data as CartType;

        if (this.favorites && cart && cart.items.length > 0) {
          this.favorites = this.favorites.map((favorite) => {
            if (cart) {
              const productInCart = cart.items.find((item) => item.product.id === favorite.id);

              if (productInCart) {
                favorite.countInCart = productInCart.quantity;
              }
            }
            return favorite
          })
        }
      })
  }

  removeFavorite(id: string): void {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }

        this.favorites = this.favorites.filter(favorite => favorite.id !== id);
      });
  }
}
