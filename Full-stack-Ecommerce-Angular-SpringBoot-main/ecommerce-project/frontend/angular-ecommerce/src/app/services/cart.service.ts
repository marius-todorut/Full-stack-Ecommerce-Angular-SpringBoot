import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // the shopping cart
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCatItem: CartItem) {

    let alreadyInCart: boolean = false;
    let existingCartItem!: CartItem;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempItem => tempItem.id === theCatItem.id)!;

      // check if we found the item in cart
      alreadyInCart = (existingCartItem != undefined);
    }



    if (alreadyInCart) {
      // already in cart, increase quantity
      existingCartItem.quantity++;
    }
    else {
      // add the item to the cart
      this.cartItems.push(theCatItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish values to all subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    console.log(`totalPrice: ${totalPriceValue}, totalQuantity: ${totalQuantityValue}`);

  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    
    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempItem => tempItem.id === cartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}


