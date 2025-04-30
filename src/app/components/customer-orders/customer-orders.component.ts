import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';

import { Order } from '../../types/order';
import { Product } from '../../types/product';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule,RouterModule],
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
})
export class CustomerOrdersComponent implements OnInit {
  orders: Order[] = [];
  orderService = inject(OrderService);

  cancelReason = '';
  cancelingOrderId: string | null = null;
  successMessage = '';
  errorMessage = '';

  orderSuccessMessage = '';
  paymentType = '';

  editingAddressId: string | null = null;
  updatedAddress = {
    address1: '',
    city: '',
    pincode: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.fetchOrders();
  
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state;
  
    if (state?.['orderSuccess']) {
      this.orderSuccessMessage = '✅ Order placed successfully!';
      this.paymentType = state['paymentType'];
    }
  }
  
  fetchOrders() {
    this.orderService.getCustomerOrders().subscribe(result => {
      this.orders = result;
    });
  }

  getSellingPrice(product: Product): number {
    return Math.round(product.price - (product.price * product.discount) / 100);
  }

  // Cancel Order
  confirmCancel(orderId: string) {
    this.cancelingOrderId = orderId;
    this.cancelReason = '';
  }

  cancelOrder() {
    if (!this.cancelingOrderId || !this.cancelReason.trim()) {
      this.errorMessage = 'Cancellation reason is required.';
      return;
    }

    this.orderService.cancelOrder(this.cancelingOrderId, this.cancelReason).subscribe({
      next: () => {
        this.successMessage = 'Order cancelled successfully.';
        this.errorMessage = '';
        this.cancelingOrderId = null;
        this.cancelReason = '';
        this.fetchOrders();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to cancel order.';
      }
    });
  }

  cancelCancel() {
    this.cancelingOrderId = null;
    this.cancelReason = '';
    this.errorMessage = '';
  }

  isPending(status: string | undefined): boolean {
    const allowed = ['pending', 'inprogress'];
    return !!status && allowed.includes(status.trim().toLowerCase());
  }

  // Address Edit
  editAddress(orderId: string) {
    const order = this.orders.find(o => o._id === orderId);
    if (order) {
      this.editingAddressId = orderId;
      this.updatedAddress = {
        address1: order.address.address1,
        city: order.address.city,
        pincode: order.address.pincode
      };
    }
  }

  submitAddress(orderId: string) {
    this.orderService.updateOrderAddress(orderId, this.updatedAddress).subscribe({
      next: () => {
        this.successMessage = 'Address updated successfully.';
        this.editingAddressId = null;
        this.fetchOrders();
      },
      error: () => {
        this.errorMessage = 'Failed to update address.';
      }
    });
  }

  cancelEditAddress() {
    this.editingAddressId = null;
    this.updatedAddress = { address1: '', city: '', pincode: '' };
  }
}
