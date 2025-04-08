import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ProductCardComponent,
    MatIcon
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  customerService = inject(CustomerService);
  route = inject(ActivatedRoute);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  product!: Product;
  selectedImage: string = '';
  quantity: number = 1;
  reviewText: string = '';
  reviewRating: number = 0; // Default to 0, so user selects rating manually
  similarProducts: Product[] = [];
  reviews: any[] = [];
  isAdmin: boolean = false;
  loading: boolean = false;

  ngOnInit() {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    this.isAdmin = user?.isAdmin;

    const id = this.route.snapshot.paramMap.get("id");

    if (id) {
      this.customerService.getProductById(id).subscribe((result) => {
        this.product = result;
        this.selectedImage = result.images?.[0] || 'https://via.placeholder.com/400x400';

        this.loadReviews();

        if (this.product.categoryId) {
          this.customerService.getProducts('', this.product.categoryId, '', -1, '', 1, 4).subscribe(
            (result) => this.similarProducts = result,
            (error) => console.error('Error fetching similar products:', error)
          );
        }

        this.loading = false;
      });
    }
  }

  deleteReview(reviewId: string) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.customerService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r._id !== reviewId);
        },
        error: (err) => {
          console.error('Error deleting review:', err);
        }
      });
    }
  }
  

  loadReviews() {
    if (this.product?._id) {
      this.customerService.getReviews(this.product._id).subscribe((reviews) => {
        this.reviews = reviews;
      });
    }
  }

  submitReview() {
    if (!this.reviewText.trim() || this.reviewRating === 0) {
      alert("Please provide a rating and review text before submitting.");
      return;
    }

    this.customerService.submitReview(this.product._id!, this.reviewText, this.reviewRating).subscribe(() => {
      this.reviewText = '';
      this.reviewRating = 0;
      this.loadReviews();
    });
  }

  selectImage(image: string) {
    this.selectedImage = image;
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

  
}
