import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../types/order';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  formbuilder = inject(FormBuilder);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  cartItems: any[] = [];
  orderStep: number = 0;
  paymentType = 'cash';
  isPlacingOrder = false;

  addressForm = this.formbuilder.group({
    address1: [''],
    address2: [''],
    city: [''],
    pincode: [''],
    paymentType: ['cash']
  });

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.cdr.detectChanges();
    });
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.addToCart(item.product._id, newQuantity).subscribe(() => {
        item.quantity = newQuantity;
        this.cdr.detectChanges();
      });
    } else {
      this.removeFromCart(item.product._id);
    }
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.product._id !== productId);
      this.cdr.detectChanges();
    });
  }

  checkout() {
    this.orderStep = 1;
  }

  addAddress() {
    this.orderStep = 2;
  }

  completeOrder() {
    if (this.isPlacingOrder) return; // prevent double submission
    this.isPlacingOrder = true;
  
    let order: Order = {
      items: this.cartItems,
      paymentType: this.addressForm.value.paymentType || this.paymentType,
      address: {
        address1: this.addressForm.value.address1 || '',
        address2: this.addressForm.value.address2 || '',
        city: this.addressForm.value.city || '',
        pincode: this.addressForm.value.pincode || ''
      },
      date: new Date(),
      totalPrice: this.totalPrice
    };
  
    this.orderService.addOrder(order).subscribe({
      next: () => {
        this.cartService.init();
        this.orderStep = 0;
        this.isPlacingOrder = false;
        alert("✅ Your Order is Completed!");
        this.router.navigateByUrl("/orders");
      },
      error: () => {
        this.isPlacingOrder = false;
        alert("❌ Something went wrong. Please try again.");
      }
    });
  
    console.log(order);
  }
  

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
