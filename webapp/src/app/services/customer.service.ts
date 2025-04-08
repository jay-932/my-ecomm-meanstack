import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../types/product';
import { Brand } from '../types/brand';
import { Category } from '../types/category';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:3000/customer';

  constructor(private http: HttpClient) {}

  getNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/new-products`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/featured-products`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/brands`);
  }

  getProducts(
    searchTerm: string,
    categoryId: string,
    sortBy: string,
    sortOrder: number,
    brandId: string,
    page: number,
    pageSize: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/products?searchTerm=${searchTerm}&categoryId=${categoryId}&sortBy=${sortBy}&sortOrder=${sortOrder}&brandId=${brandId}&page=${page}&pageSize=${pageSize}`
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/product/${id}`);
  }

  deleteProduct(productId: string) {
    return this.http.delete(`http://localhost:3000/products/${productId}`);
  }

  submitReview(productId: string, comment: string, rating: number = 5): Observable<any> {
    return this.http.post(`${this.baseUrl}/products/${productId}/reviews`, {
      comment,
      rating
    });
  }

  getReviews(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/${productId}/reviews`);
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reviews/${reviewId}`);
  }
}
