import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginType: string = '';
  hidePassword = true;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid || !this.loginType) {
      this.toastr.warning("Please select login type and fill all required fields.");
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        console.log(response)
        const isAdmin = response.user.isAdmin;

        if (this.loginType === 'user' && isAdmin) {
          this.toastr.error("This account is an admin. Please select Admin Login.");
          return;
        } else if (this.loginType === 'admin' && !isAdmin) {
          this.toastr.error("This account is not admin. Please select User Login.");
          return;
        }

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.toastr.success("Login Successful!");
        this.loginForm.reset();

        this.router.navigateByUrl(isAdmin ? '/admin' : '/home');
      },
      error: (error) => {
        const message = error.error?.message || error.error?.error || "Login Failed! Please try again.";

        if (message.toLowerCase().includes("email")) {
          this.toastr.error("Invalid email. Please enter a registered email.");
        } else if (message.toLowerCase().includes("password")) {
          this.toastr.error("Incorrect password. Please try again.");
        } else {
          this.toastr.error(message);
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goToForgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
}
