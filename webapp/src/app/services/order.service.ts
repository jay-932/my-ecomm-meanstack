import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../types/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  http = inject(HttpClient);

  private customerUrl = 'http://localhost:3000/customer';
  private baseUrl = 'http://localhost:3000/orders';

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Get Orders of Logged-in Customer
  getCustomerOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.customerUrl}/orders`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Add New Order
  addOrder(order: Order) {
    return this.http.post(`${this.customerUrl}/order`, order, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get Admin Orders
  getAdminOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update Order Status
  updateOrderStatus(id: string, status: string) {
    return this.http.put(`${this.baseUrl}/${id}`, { status }, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Cancel Order by User
  cancelOrder(orderId: string, reason: string) {
    return this.http.patch(`${this.baseUrl}/${orderId}/cancel`, { reason }, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Cancel Order by Admin
  cancelOrderByAdmin(orderId: string, reason: string) {
    return this.http.patch(`${this.baseUrl}/${orderId}/cancel`, { reason }, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete Order (Admin Only)
  deleteOrder(orderId: string) {
    return this.http.delete(`${this.baseUrl}/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete a single item from an order (Admin)
deleteOrderItem(orderId: string, itemId: string) {
  return this.http.patch(`${this.baseUrl}/${orderId}/items/${itemId}/delete`, {}, {
    headers: this.getAuthHeaders()
  });
}

updateOrderAddress(orderId: string, address: any) {
  return this.http.patch(`${this.baseUrl}/${orderId}/update-address`, address, {
    headers: this.getAuthHeaders()
  });
}


}
