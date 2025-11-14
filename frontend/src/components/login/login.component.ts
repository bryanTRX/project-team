import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showLoginModal = false;
  isLoginMode = true;
  email = '';
  password = '';
  name = '';

  toggleModal(): void {
    this.showLoginModal = !this.showLoginModal;
    if (this.showLoginModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.email = '';
    this.password = '';
    this.name = '';
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      // Login logic
      console.log('Login:', { email: this.email, password: this.password });
      alert(`Welcome back! Logging in as ${this.email}`);
      this.toggleModal();
    } else {
      // Sign up logic
      console.log('Sign up:', { name: this.name, email: this.email, password: this.password });
      alert(`Welcome ${this.name}! Account created successfully.`);
      this.toggleModal();
    }
  }

  closeModal(): void {
    this.showLoginModal = false;
    document.body.style.overflow = '';
  }
}

