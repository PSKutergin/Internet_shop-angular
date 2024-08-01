import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartType } from 'src/app/types/cart.type';
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

  constructor(private productService: ProductService, private cartService: CartService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {

          this.cartService.getCart()
            .subscribe((cartData: CartType) => {
              if (cartData) {
                const productInCart = cartData.items.find((item) => item.product.id === data.id);
                if (productInCart) {
                  data.countInCart = productInCart.quantity;
                  this.count = productInCart.quantity;
                }
              }

              this.product = data;
            });
        })
    })

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => this.products = data);
  }

  updateCount(count: number): void {
    this.count = count;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.product.countInCart = this.count;
        });
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.product.countInCart = this.count;
      });
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.product.countInCart = 0;
        this.count = 1
      });
  }

}
