import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../types/product';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-buy-now',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatRadioModule
  ],
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss']
})
export class BuyNowComponent implements OnInit {
  selectedMethod: 'cod' | 'online' = 'cod';
  paymentDone = false;
  upiCopied = false;

  address = {
    line1: '',
    city: '',
    zip: ''
  };

  constructor(
    public dialogRef: MatDialogRef<BuyNowComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {}

  get upiLink(): string {
    const upiId = 'pay@upi';
    const name = 'MyShop';
    const amount = this.product.price;

    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=0000&tid=TXN123456&tr=ORDER${Date.now()}&am=${amount}&cu=INR&mode=02&purpose=00`;
  }

  get encodedUpiLink(): string {
    return encodeURIComponent(this.upiLink);
  }

  isMobile(): boolean {
    return /Android|iPhone|iPad/i.test(navigator.userAgent);
  }

  openUpiIntent() {
    if (this.isMobile()) {
      window.location.href = this.upiLink;
    } else {
      alert('Please scan the QR code or use this feature on your mobile phone to pay via UPI app.');
    }
  }

  launchRazorpay() {
    const razorpayOptions = {
      key: 'rzp_test_YourKeyHere', // Replace with your Razorpay key
      amount: this.product.price * 100,
      currency: 'INR',
      name: 'MyShop',
      description: `Payment for ${this.product.name}`,
      image: 'https://yourdomain.com/logo.png',
      handler: (response: any) => {
        alert('✅ Payment Successful! Payment ID: ' + response.razorpay_payment_id);
        this.selectedMethod = 'online';
        this.confirmPayment();
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9876543210'
      },
      notes: {
        product_id: this.product._id
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          alert('⚠️ Payment cancelled or popup closed.');
        }
      }
    };

    const rzp = new Razorpay(razorpayOptions);

    rzp.on('payment.failed', (response: any) => {
      alert('❌ Payment failed: ' + response.error.description);
    });

    rzp.open();
  }

  confirmPayment() {
    this.orderService.addOrder({
      date: new Date(),
      items: [{ product: this.product, quantity: 1 }],
      paymentType: this.selectedMethod,
      address: this.address,
      status: this.selectedMethod === 'cod' ? 'Pending' : 'Paid',
      totalPrice: this.product.price
    }).subscribe(() => {
      this.paymentDone = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/orders']);
      }, 1500);
    });
  }

  copyUpiId() {
    const upiId = 'pay@upi';
    const amount = this.product.price;
    const upiLink = `upi://pay?pa=${upiId}&pn=MyShop&am=${amount}&cu=INR`;
  
    navigator.clipboard.writeText(upiId).then(() => {
      this.upiCopied = true;
  
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      
      setTimeout(() => {
        this.upiCopied = false;
  
        if (isMobile) {
          // Mobile: Open UPI app directly
          window.location.href = upiLink;
        } else {
          // Desktop: Open Razorpay UPI hosted page (or your own QR page)
          window.open('https://razorpay.com/payment-button-link', '_blank');
          // Replace above URL with your own UPI page if needed
        }
      }, 1000);
    });
  }
  
  
}
