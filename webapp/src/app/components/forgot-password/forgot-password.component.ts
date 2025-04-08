import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  message = '';
  error = '';
  previewLink = '';
  form!: FormGroup;
  showResend = false;
  countdown = 60;
  intervalId: any;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.message = '';
    this.error = '';
    this.previewLink = '';
    this.showResend = false;
    this.countdown = 60;
    clearInterval(this.intervalId);

    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.previewLink = res.previewLink || '';
        this.startCountdown();
      },
      error: err => {
        this.error = err.error?.error || 'Something went wrong';
      }
    });
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.previewLink = '';
        this.showResend = true;
      }
    }, 1000);
  }

  resendLink() {
    this.onSubmit();
  }
}
