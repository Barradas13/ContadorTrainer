import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contador',
  standalone: true,
  imports: [NgIf],
  templateUrl: './contador.component.html',
  styleUrl: './contador.component.css'
})

export class ContadorComponent implements OnInit {
  deckId: string = '';
  currentCardImage: string = 'assets/card-back.png'; // Imagem de verso de carta inicial
  intervalId: any;

  cardCount: number = 0;
  cardsDrawn: number = 0;
  cardsUntilAnswer: number = 0;

  userCanAnswer: boolean = false;
  isPaused: boolean = false;
  
  lastFeedback: { message: string; isCorrect: boolean } | null = null;
  totalCorrect: number = 0;
  totalAttempts: number = 0;
  accuracy: number = 100;

  ngOnInit(): void {
    this.startNewDeck();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  // -----------------------------------------------------------
  // INÍCIO DO DECK
  // -----------------------------------------------------------
  async startNewDeck() {
    this.userCanAnswer = false;
    this.isPaused = false;
    this.cardCount = 0;
    this.cardsDrawn = 0;
    this.lastFeedback = null;
    this.currentCardImage = 'assets/card-back.png';

    // define quantas cartas até liberar o usuário
    this.cardsUntilAnswer = this.randomBetween(5, 15);

    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await res.json();
    this.deckId = data.deck_id;

    this.startDrawingLoop();
  }

  // -----------------------------------------------------------
  // LOOP DE VIRAR CARTAS
  // -----------------------------------------------------------
  startDrawingLoop() {
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.drawCard();
    }, 1000);
  }

  // -----------------------------------------------------------
  // PUXA UMA CARTA
  // -----------------------------------------------------------
  async drawCard() {
    if (this.userCanAnswer || this.isPaused) return;

    // Se acabou o baralho
    if (this.cardsDrawn >= 52) {
      clearInterval(this.intervalId);

      setTimeout(() => {
        alert("Acabaram as 52 cartas! Reiniciando o deck...");
        this.startNewDeck();
      }, 500);
      
      return;
    }

    // Faz o draw da API
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`);
    const data = await res.json();

    if (!data.success) {
      console.error('Erro ao puxar carta:', data);
      this.startNewDeck();
      return;
    }

    const card = data.cards[0];
    this.currentCardImage = card.image;
    this.cardsDrawn++;

    // Atualiza contagem High-Low
    this.updateRunningCount(card.value);

    // Hora de liberar o usuário?
    if (this.cardsDrawn >= this.cardsUntilAnswer && !this.userCanAnswer) {
      this.userCanAnswer = true;
      clearInterval(this.intervalId);
    }
  }

  // -----------------------------------------------------------
  // LÓGICA DO HIGH-LOW
  // -----------------------------------------------------------
  updateRunningCount(value: string) {
    const high = ["10", "JACK", "QUEEN", "KING", "ACE"];
    const low = ["2", "3", "4", "5", "6"];

    if (high.includes(value)) {
      this.cardCount--;
    } else if (low.includes(value)) {
      this.cardCount++;
    }
    // 7, 8, 9 não alteram a contagem
  }

  // -----------------------------------------------------------
  // APÓS O USUÁRIO CLICAR "ENVIAR"
  // -----------------------------------------------------------
  checkUserAnswer(userInput: string) {
    const userValue = Number(userInput);
    this.totalAttempts++;
    
    if (userValue === this.cardCount) {
      this.totalCorrect++;
      this.lastFeedback = {
        message: "✔ Resposta correta!",
        isCorrect: true
      };
    } else {
      this.lastFeedback = {
        message: `❌ Errado! A contagem correta era ${this.cardCount}.`,
        isCorrect: false
      };
    }
    
    // Atualiza precisão
    this.accuracy = Math.round((this.totalCorrect / this.totalAttempts) * 100);
    
    // Limpa o input
    const input = document.getElementById('countValue') as HTMLInputElement;
    if (input) input.value = '';
    
    // Permite continuar após breve pausa
    setTimeout(() => {
      this.userCanAnswer = false;
      this.lastFeedback = null;
      this.startDrawingLoop();
    }, 2000);
  }

  // -----------------------------------------------------------
  // CONTROLES ADICIONAIS
  // -----------------------------------------------------------
  toggleDrawing() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      clearInterval(this.intervalId);
    } else if (!this.userCanAnswer) {
      this.startDrawingLoop();
    }
  }

  showHelp() {
    alert(`
      🃏 CONTAGEM HIGH-LOW (HI-LO):
      
      +1: 2, 3, 4, 5, 6
        0: 7, 8, 9
      -1: 10, J, Q, K, A
      
      Regras:
      1. As cartas aparecem automaticamente
      2. Responda quando o sistema pedir
      3. Tente acertar a contagem atual
      
      Sua precisão: ${this.accuracy}% (${this.totalCorrect}/${this.totalAttempts})
    `);
  }

  // -----------------------------------------------------------
  // FUNÇÃO RANDOM
  // -----------------------------------------------------------
  randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}