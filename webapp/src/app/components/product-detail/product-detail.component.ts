import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';  // ✅ RouterModule import किया
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
  imports: [CommonModule, RouterModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ProductCardComponent,MatIcon], // ✅ RouterModule जोड़ा
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  customerService = inject(CustomerService);
  route = inject(ActivatedRoute);
  product!: Product;
  selectedImage: string = ''; 
  quantity: number = 1;
  reviewText: string = '';  
  similarProducts: Product[] = []; // ✅ similarProducts को initialize किया
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    
    if (id) {
      this.customerService.getProductById(id).subscribe((result) => {
        this.product = result;
        this.selectedImage = result.images?.[0] || 'https://via.placeholder.com/400x400';

        // ✅ Similar Products API Call (Ensure 'categoryId' exists)
        if (this.product.categoryId) {
          this.customerService.getProducts('', this.product.categoryId, '', -1, '', 1, 4).subscribe(
            (result) => {
              this.similarProducts = result;
              console.log('Similar Products:', this.similarProducts);
            },
            (error) => console.error('Error fetching similar products:', error)
          );
        }
      });
    }
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  get SellingPrice() {
    return Math.round(this.product.price - (this.product.price * this.product.discount) / 100);
  }

  // addToCart() {
  //   console.log(`Added ${this.quantity} of ${this.product?.name} to cart!`);
  // }

  submitReview() {
    console.log("Review Submitted: ", this.reviewText);
    this.reviewText = ''; // Reset review field
  }


   addToWishList(product: Product) {
      console.log("Wishlist Action:", product);
      if (this.isInWishlist(product)) {
        this.wishlistService.removeFromWishlists(product._id!).subscribe(() => {
          this.wishlistService.init();  // Refresh wishlist
        });
      } else {
        this.wishlistService.addIntWishlists(product._id!).subscribe(() => {
          this.wishlistService.init();  // Refresh wishlist
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
