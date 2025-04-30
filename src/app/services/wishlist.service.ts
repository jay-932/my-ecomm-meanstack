import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../types/product';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  // init() {
  //   throw new Error('Method not implemented.');
  // }
  constructor() {}
  http = inject(HttpClient);
  wishlists: Product[] = [];

  // Method to initialize the wishlists
  init() {
   this.getWishlists().subscribe((result) => {
      this.wishlists = result;
    });
  }

  private apiUrl = 'http://localhost:3000/customer';

  // Method to fetch all wishlists
  getWishlists() {
    return this.http.get<Product[]>(`${this.apiUrl}/wishlists`);
  }

  // Method to add a product to the wishlist
  addIntWishlists(productId: string) {
    return this.http.post(`${this.apiUrl}/wishlists/${productId}`, {});
  }

  // Method to remove a product from the wishlist
  removeFromWishlists(productId: string) {
    return this.http.delete(`${this.apiUrl}/wishlists/${productId}`);
  }
}
