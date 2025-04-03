import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../types/product';

import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-wishlists',
  standalone: true,
  imports: [CommonModule, ProductCardComponent], // ✅ Add CommonModule
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
