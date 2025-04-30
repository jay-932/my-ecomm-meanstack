import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // ✅ Import Toastr
import { CommonModule } from '@angular/common'; // ✅ Add CommonModule for HTML templates

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService); // ✅ Inject Toastr

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastr.warning("Please fill all required fields correctly.");
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.toastr.success("User Registered Successfully!");
        this.registerForm.reset();
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        const message = error.error?.error || "Registration Failed! Please try again.";
        this.toastr.error(message);
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
