import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tela-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-jogo.component.html',
  styleUrl: './tela-jogo.component.css'
})
export class TelaJogoComponent {

  cartasJogador: string[] = ['🂡', '🂫', '🂭']; // exemplo visual

  truco() {
    alert('TRUCO!');
  }

  seis() {
    alert('SEIS!');
  }

  nove() {
    alert('NOVE!');
  }

  doze() {
    alert('DOZE!');
  }

  jogarCarta(carta: string) {
    alert('Carta jogada: ' + carta);
  }
}
