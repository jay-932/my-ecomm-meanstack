import { Component, inject, Input } from '@angular/core';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { BuyNowComponent } from '../buy-now/buy-now.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  dialog = inject(MatDialog);

  constructor() {
    this.cartService.init();
  }

  get SellingPrice() {
    return Math.round(this.product.price - (this.product.price * this.product.discount) / 100);
  }

  addToWishList(product: Product) {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlists(product._id!).subscribe(() => {
        this.wishlistService.init();
      });
    } else {
      this.wishlistService.addIntWishlists(product._id!).subscribe(() => {
        this.wishlistService.init();
      });
    }
  }

  isInWishlist(product: Product): boolean {
    return !!this.wishlistService.wishlists.find(x => x._id === product._id);
  }

  onWishlistClick(event: Event, product: any) {
    event.stopPropagation();
    event.preventDefault();
    this.addToWishList(product);
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.isProductInCart(product._id!)) {
      this.cartService.addToCart(product._id, 1).subscribe(() => {
        this.cartService.init();
      });
    } else {
      this.cartService.removeFromCart(product._id!).subscribe(() => {
        this.cartService.init();
      });
    }
  }

  isProductInCart(productId: string): boolean {
    return this.cartService.items.some(x => x.product._id === productId);
  }

  openBuyNowModal(product: Product) {
    this.dialog.open(BuyNowComponent, {
      width: '400px',
      data: product
    });
  }
}
