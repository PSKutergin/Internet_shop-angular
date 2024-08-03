import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { CartType } from 'src/app/types/cart.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { DeliveryType } from 'src/app/types/delivery.type';
import { OrderType } from 'src/app/types/order.type';
import { PaymentType } from 'src/app/types/payment.type';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  deliveryType: DeliveryType = DeliveryType.delivery;
  cart: CartType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;

  orderForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    fatherName: [''],
    phone: ['', [Validators.required]],
    paymentType: [PaymentType.cashToCourier, [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: ['']
  });
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder) {
    this.updateDeliveryTypeValidation();
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.cart = data as CartType;

        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this._snackBar.open('Корзина пустая');
          this.router.navigate(['/']);
          return;
        }
        this.calculateTotal();
      });
  }

  get firstName() {
    return this.orderForm.get('firstName');
  }

  get lastName() {
    return this.orderForm.get('lastName');
  }

  get fatherName() {
    return this.orderForm.get('fatherName');
  }

  get phone() {
    return this.orderForm.get('phone');
  }

  get paymentType() {
    return this.orderForm.get('paymentType');
  }

  get email() {
    return this.orderForm.get('email');
  }

  get street() {
    return this.orderForm.get('street');
  }

  get house() {
    return this.orderForm.get('house');
  }

  get entrance() {
    return this.orderForm.get('entrance');
  }

  get apartment() {
    return this.orderForm.get('apartment');
  }

  get comment() {
    return this.orderForm.get('comment');
  }

  changeDeliveryType(type: DeliveryType): void {
    this.deliveryType = type;

    this.updateDeliveryTypeValidation();
  }

  updateDeliveryTypeValidation(): void {
    if (this.deliveryType === DeliveryType.delivery) {
      this.street?.setValidators([Validators.required]);
      this.house?.setValidators([Validators.required]);
    } else {
      this.street?.removeValidators([Validators.required]);
      this.house?.removeValidators([Validators.required]);
      this.street?.setValue('');
      this.house?.setValue('');
      this.entrance?.setValue('');
      this.apartment?.setValue('');
    }

    this.street?.updateValueAndValidity();
    this.house?.updateValueAndValidity();
  }

  calculateTotal(): void {
    this.totalAmount = 0;
    this.totalCount = 0;
    if (this.cart) {
      this.cart.items.forEach((item) => {
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount += item.quantity;
      });
    }
  }

  createOrder(): void {
    if (this.orderForm.valid && this.firstName?.value && this.lastName?.value && this.phone?.value && this.email?.value && this.paymentType?.value) {
      console.log(this.orderForm.value);

      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        phone: this.phone?.value,
        email: this.email?.value,
        paymentType: this.paymentType?.value,
      };

      if (this.deliveryType === DeliveryType.delivery) {
        if (this.street?.value) paramsObject.street = this.street?.value;
        if (this.house?.value) paramsObject.house = this.house?.value;
        if (this.entrance?.value) paramsObject.entrance = this.entrance?.value;
        if (this.apartment?.value) paramsObject.apartment = this.apartment?.value;
      }

      if (this.comment?.value) {
        paramsObject.comment = this.comment?.value;
      }

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }

            this.dialogRef = this.dialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe(() => {
                this.router.navigate(['/']);
              })
            this.cartService.setCount(0);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при создании заказа');
            }
          }
        })
    } else {
      this.orderForm.markAllAsTouched();
      this._snackBar.open('Заполните все обязательные поля');
    }
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
