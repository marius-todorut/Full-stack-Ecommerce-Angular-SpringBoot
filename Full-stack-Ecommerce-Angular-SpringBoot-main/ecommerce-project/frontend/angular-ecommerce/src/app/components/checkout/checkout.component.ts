import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { CustomValidators } from '../../validators/custom-validators';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFromGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  constructor(private formBuilder: FormBuilder, private formService: FormService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.checkoutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.checkBlanksValidation]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.checkBlanksValidation]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
        city: new FormControl('', [Validators.required, Validators.minLength(2)]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
        city: new FormControl('', [Validators.required, Validators.minLength(2)]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2)]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      }),


    }
    );
    // populate credit card data
    const startMonth: number = new Date().getMonth() + 1;

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )

    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    )

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    this.cartService.computeCartTotals();

  }

  get firstName() { return this.checkoutFromGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFromGroup.get('customer.lastName'); }
  get email() { return this.checkoutFromGroup.get('customer.email'); }
  get street() { return this.checkoutFromGroup.get('shippingAddress.street') }
  get country() { return this.checkoutFromGroup.get('shippingAddress.country') }
  get state() { return this.checkoutFromGroup.get('shippingAddress.state') }
  get zipCode() { return this.checkoutFromGroup.get('shippingAddress.zipCode') }
  get city() { return this.checkoutFromGroup.get('shippingAddress.city') }
  get nameOnCard() { return this.checkoutFromGroup.get('creditCard.nameOnCard') }
  get cardNumber() { return this.checkoutFromGroup.get('creditCard.cardNumber') }
  get securityCode() { return this.checkoutFromGroup.get('creditCard.securityCode') }
  get cardType() { return this.checkoutFromGroup.get('creditCard.cardType') }
  get expirationMonth() { return this.checkoutFromGroup.get('creditCard.expirationMonth') }
  get expirationYear() { return this.checkoutFromGroup.get('creditCard.expirationYear') }
  get bstreet() { return this.checkoutFromGroup.get('billingAddress.street') }
  get bcountry() { return this.checkoutFromGroup.get('billingAddress.country') }
  get bstate() { return this.checkoutFromGroup.get('billingAddress.state') }
  get bzipCode() { return this.checkoutFromGroup.get('billingAddress.zipCode') }
  get bcity() { return this.checkoutFromGroup.get('billingAddress.city') }



  mirrorShipping($event: Event) {

    const target = $event.target as HTMLInputElement | null;

    if (target?.checked) {
      this.checkoutFromGroup.controls['billingAddress'].setValue(this.checkoutFromGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFromGroup.controls['billingAddress'].reset();
    }
  }
  onSubmit() {

    console.log("Handling the submit button");

    this.checkoutFromGroup.updateValueAndValidity();

    if (this.checkoutFromGroup.invalid) {
      this.checkoutFromGroup.markAllAsTouched();

    }
    else {
      this.router.navigateByUrl('/purchase');
    }
  }

  handleMonthsYears() {

    const creditCardFormGroup = this.checkoutFromGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }
}
