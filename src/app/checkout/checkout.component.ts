import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // Declare variables for total price, cart data, and order message
  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    // Load cart details to calculate the total price
    this.product.currentCart().subscribe((result) => {
      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity);
        }
      });
      // Calculate the total price including tax and delivery
      this.totalPrice = price + (price / 10) + 100 - (price / 10);
      console.warn(this.totalPrice);
    });
  }

  // Function to place an order
  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (this.totalPrice) {
      // Create order data based on user input
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined
      };

      // Delete items from the cart after placing the order
      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id);
        }, 700);
      });

      // Make an API call to place the order
      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          // Display a success message
          this.orderMsg = "Order has been placed";
          setTimeout(() => {
            this.orderMsg = undefined;
            // Navigate to my-orders page after a successful order
            this.router.navigate(['/my-orders']);
          }, 4000);
        }
      });
    }
  }
}


/*
It allows users to enter shipping address details and place an order.
The TypeScript code calculates the total price based on the items in the cart, places the order, and then navigates to the "my-orders" page upon successful order placement. */
