import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';  // ✅ Change Detection for Instant UI Update
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor,ReactiveFormsModule,MatInputModule,MatRadioModule,FormsModule], // ✅ Importing CommonModule and Directives
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cartService = inject(CartService);
  cartItems: any[] = [];
  private cdr = inject(ChangeDetectorRef);
  formbuilder=inject(FormBuilder);
  orderService = inject(OrderService)
  paymentType='cash';
  router=inject(Router)
  addressForm=this.formbuilder.group({
    address1:[''],
    address2:[''],
    city:[],
    pincode:['']
  })
  totalAmount: any;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.cdr.detectChanges(); // ✅ UI ko force update karne ke liye
    });
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.addToCart(item.product._id, newQuantity).subscribe(() => {
        item.quantity = newQuantity; // ✅ UI turant update ho
        this.cdr.detectChanges(); // ✅ Change detection trigger kare
      });
    } else {
      this.removeFromCart(item.product._id);
    }
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.product._id !== productId);
      this.cdr.detectChanges(); // ✅ UI turant update kare
    });
  }


  orderStep:number=0;
  checkout(){
    this.orderStep=1;

  }

  addAddress(){
    this.orderStep=2;
  }

  completeOrder(){
    let order:Order = {
      items:this.cartItems,
      paymentType:this.paymentType,
      address:this.addressForm.value,
      date:new Date(),
      totalPrice:this.totalPrice
    };
    this.orderService.addOrder(order).subscribe(result=>{
      alert("Your Order Is Completed");
      this.cartService.init();
      this.orderStep = 0;
      this.router.navigateByUrl("/orders")
    })
    console.log(order);
    
  }
}
