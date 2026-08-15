import { Component } from '@angular/core';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  // Modal visibility + which view it shows. No service — HeaderComponent
  // (or any other caller) opens this via a template reference variable,
  // e.g. <app-auth #authModal></app-auth> ... (click)="authModal.open()"
  isOpen = false;
  authMode: AuthMode = 'login';
 
  // Password visibility toggles — UI only, no validation/logic yet.
  showPassword = false;
  showConfirmPassword = false;
 
  open(mode: AuthMode = 'login'): void {
    this.authMode = mode;
    this.isOpen = true;
    
  }
 
  close(): void {
    this.isOpen = false;
  }
 
  switchTo(mode: AuthMode): void {
    this.authMode = mode;
  }
 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
