import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: product | undefined;

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    // Retrieve the product ID from the URL route parameter
    let productId = this.activeRoute.snapshot.paramMap.get('productId');

    // Fetch product details based on the product ID
    productId && this.product.getProduct(productId).subscribe((result) => {
      this.productData = result;

      // Check if the product is in the local cart (not user-logged)
      let cartData = localStorage.getItem('localCart');
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) => productId === item.id.toString());

        // If the product is in the local cart, set removeCart to true
        if (items.length) {
          this.removeCart = true;
        } else {
          this.removeCart = false;
        }
      }

      // Check if the user is logged in
      let user = localStorage.getItem('user');

      if (user) {
        let userId = user && JSON.parse(user).id;
        // Fetch the user's cart list
        this.product.getCartList(userId);

        this.product.cartData.subscribe((result) => {
          let item = result.filter((item: product) => productId?.toString() === item.productId?.toString())
          // If the product is in the user's cart, set cartData and removeCart to true
          if (item.length) {
            this.cartData = item[0];
            this.removeCart = true;
          }
        })
      }
    })
  }

  handleQuantity(val: string) {
    // Function to handle product quantity increment and decrement
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {
    // Function to add the product to the cart
    if (this.productData) {
      this.productData.quantity = this.productQuantity;

      // Check if the user is not logged in (local cart)
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId
        }

        delete cartData.id;

        // Add the product to the user's cart
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        })
      }
    }
  }

  removeToCart(productId: number) {
    // Function to remove the product from the cart
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
    } else {
      this.cartData && this.product.removeToCart(this.cartData.id).subscribe((result) => {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;

        // Fetch the user's cart list after removing the item
        this.product.getCartList(userId);
      })
    }
    this.removeCart = false;
  }
}
