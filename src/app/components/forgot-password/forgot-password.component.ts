import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
export class ForgotPasswordComponent implements OnDestroy {
  form!: FormGroup;
  message = '';
  error = '';
  previewLink = '';
  countdown = 60;
  showResend = false;
  private intervalId: any = null;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastr.warning('Please enter a valid email.');
      return;
    }

    this.message = '';
    this.error = '';
    this.previewLink = '';
    this.showResend = false;
    this.countdown = 60;

    // ✅ Make sure any previous timer is cleared before starting new one
    this.clearTimer();

    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.previewLink = res.previewLink || '';
        this.toastr.success(res.message);
        this.startCountdown();
      },
      error: err => {
        const errorMsg = err.error?.error || 'Something went wrong';
        this.toastr.error(errorMsg);
      }
    });
  }

  startCountdown() {
    this.clearTimer(); // ✅ Extra safe

    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearTimer();
        this.previewLink = '';
        this.showResend = true;
      }
    }, 1000); // ✅ Runs exactly once per second
  }

  resendLink() {
    this.onSubmit();
  }

  clearTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer(); // ✅ Prevent memory leaks
  }
}
