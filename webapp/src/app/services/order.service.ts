import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../types/order';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/customer';

  private baseUrl = 'http://localhost:3000/orders';

  getCustomerOrders() {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  addOrder(order: Order) {
    return this.http.post(`${this.apiUrl}/order`, order);
  }


  // ✅ Get Admin Orders (with Auth)
  getAdminOrder(): Observable<Order[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<Order[]>(this.baseUrl, { headers });
  }
  updateOrderStatus(id: string, status: string) {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // ✅ Token Attach
        'Content-Type': 'application/json'
    });

    return this.http.put(`${this.baseUrl}/${id}`, { status }, { headers }); // ✅ Corrected `/`
}


}
  




