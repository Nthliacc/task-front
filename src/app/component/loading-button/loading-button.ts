import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.html',
  styleUrls: ['./loading-button.css']
})
export class LoadingButtonComponent {
  // Recebe o estado de carregamento do componente pai
  @Input() isLoading: boolean = false;

  // Recebe o texto do botão quando não está carregando
  @Input() buttonText: string = 'Entrar';
}
