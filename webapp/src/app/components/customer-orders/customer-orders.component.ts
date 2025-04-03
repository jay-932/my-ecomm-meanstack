import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Order } from '../../types/order';
import { OrderService } from '../../services/order.service';
import { Product } from '../../types/product';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {
  orders: Order[] = [];
  orderService = inject(OrderService);

  ngOnInit() {
    this.orderService.getCustomerOrders().subscribe(result => {
      this.orders = result;
    });
  }

  // ✅ Selling Price Calculation
  getSellingPrice(product: Product): number {
    return Math.round(product.price - (product.price * product.discount) / 100);
  }
}
