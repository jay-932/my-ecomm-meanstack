import { Component, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import {CommonModule, DatePipe } from '@angular/common';
import { Product } from '../../../types/product';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,DatePipe,MatButtonModule,MatButtonToggleModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  orderService = inject(OrderService);
  orders:Order[]=[];

  ngOnInit(){

    this.orderService.getAdminOrder().subscribe((result)=>{
      this.orders = result;
    })
  }

   // ✅ Selling Price Calculation
    getSellingPrice(product: Product): number {
      return Math.round(product.price - (product.price * product.discount) / 100);
    }

    statusChanged(event: any, order: Order) {
      const newStatus = event.value; // ✅ Get selected status
  
      this.orderService.updateOrderStatus(order._id!, newStatus).subscribe(result => {
          alert("Order Status Updated Successfully!");
      });
  
      console.log("Updated Status:", newStatus);
  }
  

}
