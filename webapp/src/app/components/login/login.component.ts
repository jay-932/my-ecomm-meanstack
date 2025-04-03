import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService); // ✅ AuthService Injected
  private router = inject(Router); // ✅ Router Injected

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
  
        console.log("User Logged In:", response);
        alert("Login Successful!");
        this.loginForm.reset(); 
  
        // ✅ Use `isAdmin` instead of `role`
        if (response.user.isAdmin) {
          console.log("✅ Redirecting to Admin Dashboard");
          this.router.navigateByUrl('/admin'); // Admin page
        } else {
          console.log("✅ Redirecting to Home Page");
          this.router.navigateByUrl('/home'); // Normal user page
        }
      },
      error: (error) => {
        console.error("Login Failed:", error);
        alert(error.error?.message || "Login Failed! Please try again.");
      },
      complete: () => {
        console.log("Login API Call Completed.");
      }
    });
  }
  
  }
