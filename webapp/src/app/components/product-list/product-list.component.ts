import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatCardModule, FormsModule, MatButtonModule,RouterModule ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  customerService = inject(CustomerService);
  route = inject(ActivatedRoute);

  searchTerm: string = '';
  categoryId: string = '';
  brandId: string = '';
  sortBy: string = '';
  sortOrder: number = -1;
  page: number = 1;
  pageSize: number = 6;
  isNext: boolean = true;

  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];

  ngOnInit() {
    this.loadCategories();
    this.loadBrands();

    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.categoryId = params['categoryId'] || '';
      this.getProducts();
    });
  }

  loadCategories() {
    this.customerService.getCategories().subscribe((result) => {
      this.categories = result;
    });
  }

  loadBrands() {
    this.customerService.getBrands().subscribe((result) => {
      this.brands = result;
    });
  }

  getProducts() {
    setTimeout(() => {
      this.customerService.getProducts(
        this.searchTerm,
        this.categoryId,
        this.sortBy,
        this.sortOrder,
        this.brandId,
        this.page,
        this.pageSize
      ).subscribe((result) => {
        this.products = result;
        this.isNext = result.length >= this.pageSize;
      });
    }, 500);
  }

  orderChange(event: any) {
    console.log('Sort Order Changed:', event.value);
    this.sortBy = 'price';
    this.sortOrder = event.value; // ✅ 'sta' problem fixed (Correct Value Assigned)
    this.getProducts();
  }
  

  pageChange(page: number) {
    if (page >= 1) {
      this.page = page;
      this.getProducts();
    }
  }
}
