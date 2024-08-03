import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { CartType } from 'src/app/types/cart.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private count: number = 0;
  count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  setCount(count: number) {
    this.count = count;
    this.count$.next(this.count)
  }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', { withCredentials: true });
  }

  getCountCart(): Observable<{ count: number } | DefaultResponseType> {
    return this.http.get<{ count: number } | DefaultResponseType>(environment.api + 'cart/count', { withCredentials: true })
      .pipe(
        tap((data) => {
          if (!data.hasOwnProperty('error')) {
            this.setCount((data as { count: number }).count)
          }

        })
      );
  }

  updateCart(productId: string, quantity: number): Observable<CartType | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', { productId, quantity }, { withCredentials: true })
      .pipe(
        tap((data) => {
          if (!data.hasOwnProperty('error')) {
            let count = 0;
            (data as CartType).items.forEach((item) => {
              count += item.quantity
            })

            this.setCount(count);
          }
        })
      );
  }
}
