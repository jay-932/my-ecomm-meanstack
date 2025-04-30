import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../types/product';

import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlists',
  standalone: true,
  imports: [CommonModule, ProductCardComponent,RouterModule], // ✅ Add CommonModule
  templateUrl: './wishlists.component.html',
  styleUrl: './wishlists.component.scss'
})
export class WishlistsComponent implements OnInit {
  wishlists: Product[] = [];
  wishlistService = inject(WishlistService);
 

  ngOnInit() {
    this.wishlistService.getWishlists().subscribe((result: any) => {
      console.log(result); 
      this.wishlists = result;      
    });
  }
}
