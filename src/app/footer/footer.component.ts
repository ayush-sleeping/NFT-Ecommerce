import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private route: Router, private product: ProductService) {}

  // Function to log out a seller
  logout() {
    // Remove seller information from local storage
    localStorage.removeItem('seller');
    // Navigate to the home page
    this.route.navigate(['/']);
  }

  // Function to log out a user
  userLogout() {
    // Remove user information from local storage
    localStorage.removeItem('user');
    // Navigate to the user authentication page
    this.route.navigate(['/user-auth']);
    // Emit an empty cart data event using ProductService
    this.product.cartData.emit([]);
  }
}


/* footer section with multiple lists of links, divided into different sections like "About," "Payments," "Socials," "Help," and "More About Us." */
