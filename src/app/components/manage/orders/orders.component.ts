import { Component, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import { CommonModule, DatePipe } from '@angular/common';
import { Product } from '../../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatButtonToggleModule,
    RouterModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orderService = inject(OrderService);
  orders: Order[] = [];

  ngOnInit() {
    this.orderService.getAdminOrder().subscribe((result) => {
      this.orders = result;
    });
  }

  getSellingPrice(product: Product): number {
    return Math.round(product.price - (product.price * product.discount) / 100);
  }

  statusChanged(event: any, order: Order) {
    const newStatus = event.value;
    this.orderService.updateOrderStatus(order._id!, newStatus).subscribe(() => {
      alert('Order Status Updated Successfully!');
      this.ngOnInit();
    });
  }

  cancelOrder(orderId: string) {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.orderService.cancelOrderByAdmin(orderId, reason).subscribe(() => {
        alert('Order Canceled Successfully!');
        
        // 👇 Update the UI directly without refreshing
        const order = this.orders.find(o => o._id === orderId);
        if (order) {
          order.status = 'Cancelled';
          order.cancelReason = reason;
        }
      });
    }
  }

  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to permanently delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        alert('Order Deleted Successfully!');
  
        // ✅ Immediately remove from UI
        this.orders = this.orders.filter(o => o._id !== orderId);
      });
    }
  }
  

  deleteItem(orderId: string, productId: string) {
    if (confirm('Delete this item from the order?')) {
      this.orderService.deleteOrderItem(orderId, productId).subscribe(() => {
        alert('Item removed from order!');

        const order = this.orders.find(o => o._id === orderId);
        if (order) {
          order.items = order.items.filter(item => item.product._id !== productId);
        }
      });
    }
  }
}
