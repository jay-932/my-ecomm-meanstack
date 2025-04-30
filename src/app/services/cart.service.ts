import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../types/product';
import { CartItem } from '../types/cartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  http = inject(HttpClient);
  items: CartItem[] = [];

  private apiUrl = 'http://localhost:3000/customer';

  constructor() {
    this.init(); // Cart को लोड करें
  }

  init() {
    this.getCartItems().subscribe((result) => {
      this.items = result;
      console.log("Cart Updated:", this.items); // Debugging के लिए लॉग
    });
  }

  getCartItems() {
    return this.http.get<CartItem[]>(`${this.apiUrl}/carts`);
  }

  addToCart(productId: string, quantity: number) {
    return this.http.post(`${this.apiUrl}/carts/${productId}`, { quantity });
  }

  removeFromCart(productId: string) {
    return this.http.delete(`${this.apiUrl}/carts/${productId}`);
  }
}
