import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr'; // ✅ Import ToastrService

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  token = '';
  message = '';
  error = ''; // ✅ Add this to avoid the template error
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService // ✅ Inject ToastrService
  ) {
    this.token = this.route.snapshot.params['token'];

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.resetPassword(this.token, this.form.value.password!).subscribe({
      next: res => {
        this.message = 'Password reset successful. Redirecting to login...';
        this.toastr.success(this.message); // ✅ Show toast
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.error = err.error?.error || 'Something went wrong'; // ✅ Set error
        this.toastr.error(this.error); // ✅ Show toast
      }
    });
  }
}
