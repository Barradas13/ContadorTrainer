import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tela-index.component.html',
  styleUrls: ['./tela-index.component.css']
})
export class TelaIndexComponent {

  deckId: string = '';
  currentCard: any = null;

  userCount: number | null = null;
  feedback: string = '';
  isCorrect: boolean = false;

  correct = 0;
  wrong = 0;

  constructor(private http: HttpClient) {
    this.createDeck();
  }

  createDeck() {
    this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .subscribe(res => {
        this.deckId = res.deck_id;
        console.log('Deck criado:', this.deckId);
      });
  }

  drawCard() {
    if (!this.deckId) return;

    this.feedback = '';
    this.userCount = null;

    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
      .subscribe(res => {
        this.currentCard = res.cards[0];
      });
  }

  checkCount() {
    if (!this.currentCard || this.userCount === null) {
      this.feedback = 'Digite um valor primeiro';
      this.isCorrect = false;
      return;
    }

    const realCount = this.getHiLoValue(this.currentCard.value);

    if (Number(this.userCount) === realCount) {
      this.feedback = `✅ Correto! Valor da carta: ${realCount}`;
      this.isCorrect = true;
      this.correct++;
    } else {
      this.feedback = `❌ Errado! Valor correto: ${realCount}`;
      this.isCorrect = false;
      this.wrong++;
    }
  }

  getHiLoValue(value: string): number {
    if (['2', '3', '4', '5', '6'].includes(value)) return +1;
    if (['7', '8', '9'].includes(value)) return 0;
    if (['10', 'JACK', 'QUEEN', 'KING', 'ACE'].includes(value)) return -1;
    return 0;
  }
}
