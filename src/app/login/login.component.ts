import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from '../component/loading-button/loading-button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, LoadingButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage: string | null = null;
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {

    this.errorMessage = null;
    this.isLoading = true;

    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.credentials).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error => {
        this.errorMessage = 'Usuário ou senha inválidos. Por favor, tente novamente.';
        console.error('Login failed:', error);
        this.isLoading = false;
      }
    );
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
