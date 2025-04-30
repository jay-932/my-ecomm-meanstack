import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // ✅ Fix: CommonModule Import Kiya
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brand-form',
  imports: [CommonModule, FormsModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name: string = '';
    brandService = inject(BrandService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    isEdit = false;
    id: string | null = null;
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.id = params.get("id");
  
        if (this.id !== null) { // ✅ Null Check Applied
          this.isEdit = true;
          this.brandService.getBrandById(this.id).subscribe((result: any) => {
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
      this.brandService.addBrand(this.name).subscribe(() => {
        alert("Brand added");
        this.router.navigateByUrl("/admin/brands");
      });
    }
  
    update() {
      if (!this.name.trim() || !this.id) return;
      this.brandService.updateBrand(this.id, this.name).subscribe(() => {
        alert('Brand Updated Successfully');
        this.router.navigate(['/admin/brands']);
      });
    }

}
