import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { login, signUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  // BehaviorSubject to track the seller's login status
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  // EventEmitter to signal login errors
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  // Handles the seller sign-up process
  userSignUp(data: signUp) {
    this.http.post('http://localhost:3000/seller',
      data,
      { observe: 'response' }).subscribe((result) => {
        console.warn(result)
        if (result) {
          // Store seller data in local storage
          localStorage.setItem('seller', JSON.stringify(result.body));
          // Set the seller's login status to true
          this.isSellerLoggedIn.next(true);
          // Navigate to the seller's home page
          this.router.navigate(['seller-home']);
        }
      });
  }

  // Checks if a seller is already logged in and updates the login status
  reloadSeller() {
    if (localStorage.getItem('seller')) {
      // If seller data is found in local storage, set the login status to true
      this.isSellerLoggedIn.next(true);
      // Navigate to the seller's home page
      this.router.navigate(['seller-home']);
    }
  }

  // Handles the seller login process
  userLogin(data: login) {
    console.warn(data)
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        console.warn(result)
        if (result && result.body && result.body.length) {
          // If a valid seller is found, set the login status to true
          this.isSellerLoggedIn.next(true);
          // Store seller data in local storage
          localStorage.setItem('seller', JSON.stringify(result.body));
          // Navigate to the seller's home page
          this.router.navigate(['seller-home']);
        } else {
          // If login fails, emit an error event
          this.isLoginError.emit(true);
        }
      });
  }
}
