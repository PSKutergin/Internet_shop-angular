import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from 'src/app/types/product.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
