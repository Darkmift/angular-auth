import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    this.authStatusListener.next(this.isAuthenticated);
    return this.isAuthenticated;
  }

  // listener to check if user is authorized
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logIn(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    this.router.navigate(['/']);
  }

  logOut(): void {
    this.token = '';
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
    this.authStatusListener.next(false);
    this.clearLoginCredentials();
  }

  private clearLoginCredentials() {
    localStorage.removeItem('token');
  }
}
