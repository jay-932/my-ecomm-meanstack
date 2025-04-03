import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Brand } from '../types/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

   http = inject(HttpClient);
    baseUrl = 'http://localhost:3000/brand'; // ✅ Base URL Define Kiya
  
    constructor() { }
  
    getBrands() {
      return this.http.get<Brand[]>(`${this.baseUrl}`);
    }
  
    getBrandById(id: string) {
      return this.http.get<Brand>(`${this.baseUrl}/${id}`); // ✅ Correct API Path
    }
  
    addBrand(name: string) {
      return this.http.post(`${this.baseUrl}`, { name });
    }
  
    updateBrand(id: string, name: string) {
      return this.http.put(`${this.baseUrl}/${id}`, { name }); // ✅ Correct API Path
    }
  
    deleteBrandById(id: string) {
      return this.http.delete(`${this.baseUrl}/${id}`); // ✅ Correct API Path
    }
}
