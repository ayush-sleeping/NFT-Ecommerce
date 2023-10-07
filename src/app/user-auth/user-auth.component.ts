import { Component, OnInit } from '@angular/core';
import { cart, login, product, signUp } from '../data-type';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true; // Flag to toggle between login and signup forms
  authError: string = ''; // A message to display authentication errors
  constructor(private user: UserService, private product: ProductService) {}

  ngOnInit(): void {
    // Initialize user authentication status when the component loads
    this.user.userAuthReload();
  }

  signUp(data: signUp) {
    // Function to handle user signup
    this.user.userSignUp(data);
  }

  login(data: login) {
    // Function to handle user login
    this.user.userLogin(data);

    // Subscribe to invalid user authentication events
    this.user.invalidUserAuth.subscribe((result) => {
      console.warn(result);
      if (result) {
        // Display an error message if the user is not found
        this.authError = 'User not found';
      } else {
        // If authentication is successful, transfer local cart data to the remote cart
        this.localCartToRemoteCart();
      }
    });
  }

  openSignUp() {
    // Function to switch to the signup form
    this.showLogin = false;
  }

  openLogin() {
    // Function to switch to the login form
    this.showLogin = true;
  }

  localCartToRemoteCart() {
    // Function to transfer local cart data to the remote cart when a user logs in
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if (data) {
      // Parse the local cart data
      let cartDataList: product[] = JSON.parse(data);

      cartDataList.forEach((product: product, index) => {
        // Prepare cart data to be added to the remote cart
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId,
        };
        delete cartData.id;

        // Add each product to the remote cart with a delay for smooth execution
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn('Product data is stored in the database');
            }
          });
        }, 500);

        // Remove local cart data after transferring
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }

    // Refresh the user's cart list after transferring data to the remote cart
    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }
}
