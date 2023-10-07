import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // EventEmitter to signal invalid user authentication
  invalidUserAuth = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  // Handles the user sign-up process
  userSignUp(user: signUp) {
    this.http
      .post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          // Store user data in local storage
          localStorage.setItem('user', JSON.stringify(result.body));
          // Navigate to the home page after successful sign-up
          this.router.navigate(['/']);
        }
      });
  }

  // Handles the user login process
  userLogin(data: login) {
    this.http
      .get<signUp[]>(
        `http://localhost:3000/users?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result) => {
        if (result && result.body?.length) {
          // If a valid user is found, store user data in local storage
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          // Navigate to the home page after successful login
          this.router.navigate(['/']);
          // Emit an event to indicate successful login
          this.invalidUserAuth.emit(false);
        } else {
          // If login fails, emit an event to indicate authentication error
          this.invalidUserAuth.emit(true);
        }
      });
  }

  // Checks if a user is already logged in and navigates to the home page
  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
}
