import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // ✅ Backend API URL
  http = inject(HttpClient);

  constructor() {}

  // Register API
  public register(name: string, email: string, password: string) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const data = { name, email, password };
    return this.http.post(this.baseUrl + '/register', data, { headers });
  }

  // Login API
  public login(email: string, password: string) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const data = { email, password };
    return this.http.post(this.baseUrl + '/login', data, { headers });
  }

  // Check login status
  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Check admin status
  get isAdmin() {
    let userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).isAdmin : null;
  }

  // Get username
  get userName() {
    let userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).name : null;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Forgot password
  forgotPassword(email: string) {
    return this.http.post(this.baseUrl + '/forgot-password', { email });
  }

  // ✅ Fixed: Reset password with token in URL
  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/reset-password/${token}`, {
      password: newPassword
    });
  }
}
