import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';  // ✅ Import MatIconModule
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,], // ✅ Added MatIconModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);
  hidePassword = true;
  error: string = '';    
  

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) { 
      alert("Please fill all required fields correctly.");
      return; 
    }
  
    const { email, password } = this.loginForm.value;
  
    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        alert("Login Successful!");
        this.loginForm.reset(); 
  
        if (response.user.isAdmin) {
          this.router.navigateByUrl('/admin'); 
        } else {
          this.router.navigateByUrl('/home'); 
        }
      },
      error: (error) => {
        alert(error.error?.message || "Login Failed! Please try again.");
      }
    });
  }

  // ✅ Toggle Password Visibility
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // ✅ Navigate to Register Page
  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goToForgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
}
