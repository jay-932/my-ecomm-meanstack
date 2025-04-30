import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   http = inject(HttpClient);
   baseUrl = 'http://localhost:3000/product'; // ✅ Correct Base URL

   constructor() { }

   // ✅ Method to get headers with token
   private getAuthHeaders(): HttpHeaders {
     const token = localStorage.getItem('token'); // 🔥 Token retrieve karein
     return new HttpHeaders({
       'Authorization': `Bearer ${token}`,  // 🛠 Token attach karein
       'Content-Type': 'application/json'
     });
   }

   // ✅ Get all products (with auth header)
   getAllProducts(): Observable<Product[]> {
     return this.http.get<Product[]>(`${this.baseUrl}`, { headers: this.getAuthHeaders() });
   }

   // ✅ Get product by ID (with auth header)
   getProductById(id: string): Observable<Product> {
     return this.http.get<Product>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
   }

   // ✅ Add a new product (with auth header)
   addProduct(product: Product): Observable<Product> {
     return this.http.post<Product>(`${this.baseUrl}`, product, {
       headers: this.getAuthHeaders()
     });
   }

   // ✅ Update an existing product (with auth header)
   updateProduct(id: string, product: Product): Observable<Product> {
     return this.http.put<Product>(`${this.baseUrl}/${id}`, product, {
       headers: this.getAuthHeaders()
     });
   }

   // ✅ Delete product by ID (with auth header)
   deleteProductById(id: string): Observable<any> {
     return this.http.delete(`${this.baseUrl}/${id}`, {
       headers: this.getAuthHeaders()
     });
   }
}
