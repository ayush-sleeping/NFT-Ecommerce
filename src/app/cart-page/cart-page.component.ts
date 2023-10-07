import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
 // Define variables for cart data and price summary
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    // Call the loadDetails function when the component initializes
    this.loadDetails();
  }

  // Function to remove an item from the cart
  removeToCart(cartId: number | undefined) {
    // Check if cartId exists and cartData is defined
    cartId && this.cartData && this.product.removeToCart(cartId)
      .subscribe((result) => {
        // Reload cart details after removing an item
        this.loadDetails();
      });
  }

  // Function to load cart details including price summary
  loadDetails() {
    // Fetch the current cart data from the ProductService
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      console.warn(this.cartData);

      let price = 0;
      // Calculate the total price of items in the cart
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity);
        }
      });

      // Calculate the price summary
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total = price + (price / 10) + 100 - (price / 10);

      // Redirect to the homepage if the cart is empty
      if (!this.cartData.length) {
        this.router.navigate(['/']);
      }
    });
  }

  // Function to navigate to the checkout page
  checkout() {
    this.router.navigate(['/checkout']);
  }
}


/*
ngFor to iterate through cart items, displays item details, allows item removal, and provides a summary of prices.
TypeScript code includes functions for loading cart details,
                         removing items from the cart, and
                         navigating to the checkout page
*/
