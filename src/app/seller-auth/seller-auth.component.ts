import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { signUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  showLogin = false;
  authError: String = '';
  constructor(private seller: SellerService) { }

  ngOnInit(): void {
    // Reload seller data on component initialization
    this.seller.reloadSeller();
  }

  signUp(data: signUp): void {
    console.warn(data);
    // Sign up the seller with the provided data
    this.seller.userSignUp(data);
  }

  login(data: signUp): void {
    // Login the seller with the provided data
    this.seller.userLogin(data);

    // Subscribe to login errors and display an error message if necessary
    this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Email or password is not correct";
      }
    });
  }

  openLogin() {
    // Switch to the login form
    this.showLogin = true;
  }

  openSignUp() {
    // Switch to the sign-up form
    this.showLogin = false;
  }
}
