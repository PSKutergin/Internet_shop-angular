import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/shared/services/user.service';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { DeliveryType } from 'src/app/types/delivery.type';
import { PaymentType } from 'src/app/types/payment.type';
import { UserInfoType } from 'src/app/types/user-info.type';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  userInfoForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: ['']
  });
  paymentTypes = PaymentType;
  deliveryTypes = DeliveryType;
  deliveryType: DeliveryType = DeliveryType.delivery;

  constructor(private fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userService.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        this.userInfoForm.patchValue(data as UserInfoType);
        this.deliveryType = (data as UserInfoType).deliveryType || DeliveryType.delivery;
      })
  }

  get firstName() {
    return this.userInfoForm.get('firstName');
  }

  get lastName() {
    return this.userInfoForm.get('lastName');
  }

  get fatherName() {
    return this.userInfoForm.get('fatherName');
  }

  get phone() {
    return this.userInfoForm.get('phone');
  }

  get paymentType() {
    return this.userInfoForm.get('paymentType');
  }

  get email() {
    return this.userInfoForm.get('email');
  }

  get street() {
    return this.userInfoForm.get('street');
  }

  get house() {
    return this.userInfoForm.get('house');
  }

  get entrance() {
    return this.userInfoForm.get('entrance');
  }

  get apartment() {
    return this.userInfoForm.get('apartment');
  }

  changeDeliveryType(type: DeliveryType): void {
    this.deliveryType = type;

    this.userInfoForm.markAsDirty();
  }

  updateUserInfo(): void {
    if (this.userInfoForm.valid) {
      const paramsObject: UserInfoType = {
        email: this.email?.value || '',
        deliveryType: this.deliveryType,
        paymentType: this.paymentType?.value || PaymentType.cashToCourier,
      }

      paramsObject.firstName = this.firstName?.value || '';
      paramsObject.lastName = this.lastName?.value || '';
      paramsObject.fatherName = this.fatherName?.value || '';
      paramsObject.phone = this.phone?.value || '';
      paramsObject.street = this.street?.value || '';
      paramsObject.house = this.house?.value || '';
      paramsObject.entrance = this.entrance?.value || '';
      paramsObject.apartment = this.apartment?.value || '';

      this.userService.updateUserInfo(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            } else {
              this._snackBar.open('Данные успешно сохранены');
              this.userInfoForm.markAsPristine();
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            errorResponse.error && errorResponse.error ? this._snackBar.open(errorResponse.error.message) : this._snackBar.open('Ошибка обновления информации');
          }
        });
    }
  }
}
