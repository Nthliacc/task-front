import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from '../component/loading-button/loading-button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, LoadingButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', password: '' };
  message: string | null = null;
  error: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.message = null;
    this.isLoading = true;

    if (!this.user.username || !this.user.password) {
      this.message = 'Por favor, preencha todos os campos.';
      this.isLoading = false;
      return;
    }

    this.authService.register(this.user).subscribe(
      () => {
        this.message = 'Registro realizado com sucesso! Redirecionando para o login...';
        this.isLoading = false;
        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error => {
        this.error = 'Erro ao registrar. O nome de usuário pode já estar em uso.';
        console.error('Registration failed:', error);
        this.isLoading = false;
      }
    );
  }
}
