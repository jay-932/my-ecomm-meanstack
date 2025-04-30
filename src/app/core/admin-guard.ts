import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("Admin Guard Triggered!");
  console.log("User Logged In?", authService.isLoggedIn);
  console.log("User is Admin?", authService.isAdmin);

  if (authService.isLoggedIn) {
    if (authService.isAdmin) {
      console.log("✅ Access Granted: Admin Dashboard");
      return true;
    } else {
      console.log("⛔ Access Denied: Redirecting to Home Page");
      router.navigateByUrl('/home');  // 🔄 Redirect to Home Page
      return false;
    }
  } else {
    console.log("⛔ User Not Logged In: Redirecting to Login");
    router.navigateByUrl('/login');  // 🔄 Redirect to Login Page
    return false;
  }
};
