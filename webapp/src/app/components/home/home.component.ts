import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { MatCardModule } from '@angular/material/card';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BuyNowComponent } from '../buy-now/buy-now.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, CarouselModule, RouterLink, MatIcon, ProductCardComponent, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    nav: true,
    autoplay: true,
  };

  customerService = inject(CustomerService);
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  bannerImages: Product[] = [];
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  dialog = inject(MatDialog);

  ngOnInit() {
    this.customerService.getFeaturedProducts().subscribe((result) => {
      if (result?.length) {
        this.featuredProducts = result;
        this.bannerImages.push(...result);
      }
    });

    this.customerService.getNewProducts().subscribe((result) => {
      if (result?.length) {
        this.newProducts = result;
        this.bannerImages.push(...result);
      }
    });
  }

  trackByIndex(index: number, item: Product): string {
    return item._id ? item._id + '-' + index : `item-${index}`;
  }

  openBuyNowModal(product: Product) {
    this.dialog.open(BuyNowComponent, {
      width: '400px',
      data: product
    });
  }
}
