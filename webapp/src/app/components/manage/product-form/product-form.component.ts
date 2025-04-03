import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../types/category';
import { Brand } from '../../../types/brand';
import { ActivatedRoute, Router } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
  route = inject(ActivatedRoute); // ✅ ActivatedRoute for getting `id`
  router = inject(Router); // ✅ Router for navigation
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  productService = inject(ProductService);

  id!: string;
  isEdit: boolean = false;
  categories: Category[] = [];
  brands: Brand[] = [];

  productForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    shortDescription: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [null, [Validators.required, Validators.min(1)]],
    discount: [null, [Validators.min(0)]],
    images: this.formBuilder.array([]),
    categoryId: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    isFeatured:[false],
    isNewProducts:[false]
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result;
    });

    this.brandService.getBrands().subscribe((result) => {
      this.brands = result;
    });

    this.id = this.route.snapshot.params['id'];
    console.log("Product ID:", this.id);

    if (this.id) {
      this.isEdit = true;
      this.productService.getProductById(this.id).subscribe((result) => {
        this.productForm.patchValue({
          name: result.name,
          shortDescription: result.shortDescription,
          description: result.description,
          price: result.price,
          discount: result.discount,
          categoryId: result.categoryId,
          brandId: result.brandId,
          isFeatured: result.isFeatured, 
          isNewProducts: result.isNewProducts 
        });

        // ✅ Ensure images are added to FormArray
        this.images.clear();
        result.images.forEach((image: string) => {
          this.images.push(this.formBuilder.control(image));
        });

        if (this.images.length === 0) {
          this.addImage();
        }
      });
    } else {
      this.addImage();
    }
}


  // ✅ Submit Form (Handles both Add & Update)
  submitForm() {
    if (this.isEdit) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  // ✅ Add Product
  addProduct() {
    let value = this.productForm.value;

    let productData: Product = {
      _id: Math.random().toString(36).substr(2, 9), // Temporary unique ID
      name: value.name?.trim(),
      shortDescription: value.shortDescription?.trim(),
      description: value.description?.trim(),
      price: value.price,
      discount: value.discount,
      images: this.images.value.filter((img: string) => img?.trim()),
      categoryId: value.categoryId,
      brandId: value.brandId,
      isFeatured: value.isFeatured, 
      isNewProducts: value.isNewProducts,
      reviews: []
    };
    
    
    console.log("🚀 Sending Data to API:", productData);

    this.productService.addProduct(productData).subscribe((result) => {
      console.log("✅ API Response:", result);
      alert("Product Added Successfully!");
      this.router.navigateByUrl("/admin/products"); 
    }, (error) => {
      console.error("❌ API Error:", error);
    });
}

updateProduct() {
    let value = this.productForm.value;

    let productData = {
      ...value,
      images: this.images.value.filter((img: string) => img?.trim()), // ✅ Ensure images are properly stored
      isFeatured: value.isFeatured, // ✅ Fix: Add missing properties
      isNewProducts: value.isNewProducts // ✅ Fix: Add missing properties
    };

    this.productService.updateProduct(this.id, productData).subscribe((result) => {
      alert('Product Updated');
      this.router.navigateByUrl("/admin/products");
    });
}

  // ✅ Add Image Field
  addImage() {
    this.images.push(this.formBuilder.control('')); // Ensure default empty input
  }

  // ✅ Remove Image Field (Ensure at least one remains)
  removeImage() {
    if (this.images.length > 1) {
      this.images.removeAt(this.images.length - 1);
    }
  }

  // ✅ Get Images as FormArray
  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  navigateBack() {
    this.router.navigateByUrl('/admin/products'); // ✅ Navigate to Products Page
  }
}
