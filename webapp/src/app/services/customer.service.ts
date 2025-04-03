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

  private baseUrl = 'http://localhost:3000/customer'; // ✅ Ensure this is correct

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
    page:number,
    pageSize:number
 
  )
  {
    return this.http.get<Product[]>(this.baseUrl+`/products?searchTerm=${searchTerm}&categoryId=${categoryId}&sortBy=${sortBy}&sortOrder=${sortOrder}&brandId=${brandId}&page=${page}&pageSize=${pageSize}&`

    )
}
getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.baseUrl}/product/${id}`); // ✅ Corrected from 'products' to 'product'
}

/** ✅ Delete Product API */
deleteProduct(productId: string) {
  return this.http.delete(`http://localhost:3000/products/${productId}`);
}



 
}
