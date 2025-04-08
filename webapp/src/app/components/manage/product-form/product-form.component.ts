import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../types/category';
import { Brand } from '../../../types/brand';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../types/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  productService = inject(ProductService);

  id!: string;
  isEdit = false;
  categories: Category[] = [];
  brands: Brand[] = [];

  productForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    shortDescription: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    price: [null, [Validators.required, Validators.min(1)]],
    discount: [0, [Validators.min(0)]],
    images: this.formBuilder.array([]),
    categoryId: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    isFeatured: [false],
    isNewProducts: [false]
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe(result => this.categories = result);
    this.brandService.getBrands().subscribe(result => this.brands = result);

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.productService.getProductById(this.id).subscribe(result => {
        this.productForm.patchValue(result);
        this.images.clear();
        result.images.forEach((image: string) => this.images.push(this.formBuilder.control(image)));
        if (this.images.length === 0) this.addImage();
      });
    } else {
      this.addImage();
    }
  }

  submitForm() {
    if (this.isEdit) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    let productData: Product = {
      ...this.productForm.value,
      images: this.images.value.filter((img: string) => img?.trim()),
      reviews: []
    };

    this.productService.addProduct(productData).subscribe(
      () => {
        alert('Product Added Successfully!');
        this.router.navigateByUrl('/admin/products');
      },
      error => console.error('API Error:', error)
    );
  }

  updateProduct() {
    let productData = {
      ...this.productForm.value,
      images: this.images.value.filter((img: string) => img?.trim())
    };

    this.productService.updateProduct(this.id, productData).subscribe(
      () => {
        alert('Product Updated Successfully!');
        this.router.navigateByUrl('/admin/products');
      }
    );
  }

  addImage() {
    this.images.push(this.formBuilder.control(''));
  }

  removeImage() {
    if (this.images.length > 1) {
      this.images.removeAt(this.images.length - 1);
    }
  }

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  navigateBack() {
    this.router.navigateByUrl('/admin/products');
  }
}
