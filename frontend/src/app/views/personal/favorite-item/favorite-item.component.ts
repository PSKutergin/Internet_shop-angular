import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { CartType } from 'src/app/types/cart.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { FavoriteType } from 'src/app/types/favorite.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'favorite-item',
  templateUrl: './favorite-item.component.html',
  styleUrls: ['./favorite-item.component.scss']
})
export class FavoriteItemComponent implements OnInit {

  @Input() product!: FavoriteType;
  @Input() countInCart: number | undefined = 0;
  @Output() removeFavoriteEvent = new EventEmitter<string>();
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;

  constructor(private cartService: CartService, private favoriteService: FavoriteService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = this.count;
      });
  }

  updateCount(count: number): void {
    this.count = count;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.countInCart = this.count;
        });
    }
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = 0;
        this.count = 1
      });
  }

  removeFromFavorites(): void {
    this.removeFavoriteEvent.emit(this.product.id);
  }
}
