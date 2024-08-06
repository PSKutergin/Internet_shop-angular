import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderStatusUtil } from 'src/app/shared/utils/order-status';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { OrderType } from 'src/app/types/order.type';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: OrderType[] = [];
  getStatusAndColor = OrderStatusUtil.getStatusAndColor;

  constructor(private orderService: OrderService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.orderService.getOrders()
      .subscribe((data: OrderType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        };

        this.orders = (data as OrderType[]).map((order) => {
          return {
            ...order,
            statusRus: this.getStatusAndColor(order.status).name,
            color: this.getStatusAndColor(order.status).color
          }
        })
      })
  }

}
