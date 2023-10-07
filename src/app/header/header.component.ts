import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuType: string = 'default';
  sellerName: string = "";
  userName: string = "";
  searchResult: undefined | product[];
  cartItems = 0;

  constructor(private route: Router, private product: ProductService) {}

  ngOnInit(): void {
    // Subscribe to route events to determine the menu type based on the URL
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          // Get seller information from local storage and set seller name
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerData.name;
          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {
          // Get user information from local storage and set user name
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          // Get and set the cart list for the user
          this.product.getCartList(userData.id);
        } else {
          this.menuType = 'default';
        }
      }
    });

    // Get cart items count from local storage and update it
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }

  // Function to logout a seller
  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  // Function to logout a user
  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    // Emit an empty cart data event using ProductService
    this.product.cartData.emit([]);
  }

  // Function to search for products
  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result) => {
        if (result.length > 5) {
          result.length = 5;
        }
        this.searchResult = result;
      });
    }
  }

  // Function to hide search results
  hideSearch() {
    this.searchResult = undefined;
  }

  // Function to redirect to the product details page
  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }

  // Function to submit the search query
  submitSearch(val: string) {
    console.warn(val);
    this.route.navigate([`search/${val}`]);
  }
}


/* It contains navigation links, user-specific content, a search bar, and
functionality for handling different menu types based on user roles. */
