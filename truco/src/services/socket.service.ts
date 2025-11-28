import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket!: WebSocket;

  connect(ip: string) {
    this.socket = new WebSocket(`ws://${ip}:3000`);

    this.socket.onopen = () => {
      console.log('✅ Conectado ao servidor WebSocket');
    };

    this.socket.onerror = (err) => {
      console.error('❌ Erro no socket:', err);
    };

    this.socket.onclose = () => {
      console.log('⚠️ Conexão encerrada');
    };
  }

  onMessage(callback: (data: any) => void) {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (e) {
        console.warn('⚠️ Mensagem não-JSON recebida:', event.data);
      }
    };
  }

  send(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket não conectado');
      return;
    }

    this.socket.send(JSON.stringify(data));
  }

}
