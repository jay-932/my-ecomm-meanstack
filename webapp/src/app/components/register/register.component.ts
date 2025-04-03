import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  private authService = inject(AuthService); // ✅ AuthService Injected
  private router = inject(Router); // ✅ Router Injected

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
        console.log("Registered User:", response);
        alert("User Registered Successfully!");
        this.registerForm.reset(); // ✅ Form reset after successful registration
        this.router.navigateByUrl('/login'); // ✅ Redirect to login page
      },
      error: (error) => {
        console.error("Registration Failed:", error);
        alert(error.error?.message || "Registration Failed! Please try again."); // ✅ Show proper error message
      },
      complete: () => {
        console.log("Registration API Call Completed.");
      }
    });
  }
}
