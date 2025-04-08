import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';  // ✅ Import MatIconModule
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule], // ✅ Added MatIconModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);
  hidePassword = true; // ✅ Control Password Visibility

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) { 
      alert("Please fill all required fields correctly.");
      return; 
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        alert("User Registered Successfully!");
        this.registerForm.reset(); 
        this.router.navigateByUrl('/login'); // ✅ Redirect to login page
      },
      error: (error) => {
        alert(error.error?.message || "Registration Failed! Please try again.");
      }
    });
  }

  // ✅ Toggle Password Visibility
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // ✅ Navigate to Login Page
  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
