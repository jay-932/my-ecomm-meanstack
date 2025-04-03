import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // ✅ Fix: CommonModule Import Kiya
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatTableModule, MatButtonModule,MatSelectModule], // ✅ CommonModule ko imports me add kiya
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  name: string = '';
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  isEdit = false;
  id: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id");

      if (this.id !== null) { // ✅ Null Check Applied
        this.isEdit = true;
        this.categoryService.getCategoryById(this.id).subscribe((result: any) => {
          this.name = result.name;
        });
      }
    });
  }

  add() {
    if (!this.name.trim()) {
      alert("Please enter a category name");
      return;
    }
    this.categoryService.addCategory(this.name).subscribe(() => {
      alert("Category added");
      this.router.navigateByUrl("/admin/categories");
    });
  }

  update() {
    if (!this.name.trim() || !this.id) return;
    this.categoryService.updateCategory(this.id, this.name).subscribe(() => {
      alert('Category Updated Successfully');
      this.router.navigate(['/admin/categories']);
    });
  }
}
