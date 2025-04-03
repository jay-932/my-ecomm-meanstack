import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Ensure FormsModule is imported
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  customerService = inject(CustomerService);
  authService=inject(AuthService)
  router = inject(Router);
  
  categoryList: Category[] = [];
  searchQuery: string = ''; // ✅ Ensure this is defined

  ngOnInit() {
    this.customerService.getCategories().subscribe((result) => {
      this.categoryList = result;
    });
  }

  onSearch(event?: KeyboardEvent | Event) { // ✅ Accept both types
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return; // ✅ Ignore non-Enter key presses
    }
  
    console.log('Search Event:', event);
    console.log('Current searchQuery:', this.searchQuery);
  
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
    }
  }
  

  searchCategory(id: string) {
    if (!id) {
      console.warn('Category ID is missing, navigation skipped.');
      return;
    }
  
    console.log('Navigating to category:', id);
    this.router.navigate(['/products'], { queryParams: { category: id } });
  }
logout(){
  this.authService.logout();
  this.router.navigateByUrl("/login")
}

  
}
