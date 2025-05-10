import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private currentRoomId: string | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3000');
      
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.currentRoomId = null;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRoomId = null;
    }
  }

  createRoom(gameMode: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not connected');
        return;
      }

      this.socket.emit('create room', gameMode);
      
      this.socket.once('room created', (data: { roomId: string, gameMode: string }) => {
        this.currentRoomId = data.roomId;
        resolve(data.roomId);
      });
    });
  }

  joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not connected');
        return;
      }

      this.socket.emit('join room', roomId);
      
      this.socket.once('room joined', (data: { roomId: string, gameMode: string }) => {
        this.currentRoomId = data.roomId;
        resolve();
      });

      this.socket.once('room error', (error: string) => {
        reject(error);
      });
    });
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService(); 