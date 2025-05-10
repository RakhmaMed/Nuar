import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state interface
interface GameState {
  gameMode: string;
  players: Set<string>;
}

// Store active rooms with their game states
const activeRooms = new Map<string, GameState>();

// Generate a random 8-character room ID
function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Create a new room
  socket.on('create room', (gameMode: string) => {
    const roomId = generateRoomId();
    activeRooms.set(roomId, {
      gameMode,
      players: new Set([socket.id])
    });
    socket.join(roomId);
    socket.emit('room created', { roomId, gameMode });
    console.log(`Room created: ${roomId} for game mode: ${gameMode}`);
  });

  // Join an existing room
  socket.on('join room', (roomId: string) => {
    const room = activeRooms.get(roomId);
    if (room) {
      room.players.add(socket.id);
      socket.join(roomId);
      socket.emit('room joined', { roomId, gameMode: room.gameMode });
      io.to(roomId).emit('player joined', socket.id);
      console.log(`Player ${socket.id} joined room ${roomId}`);
    } else {
      socket.emit('room error', 'Room not found');
    }
  });

  // Handle leaving a room
  socket.on('leave room', (roomId: string) => {
    const room = activeRooms.get(roomId);
    if (room) {
      room.players.delete(socket.id);
      socket.leave(roomId);
      if (room.players.size === 0) {
        activeRooms.delete(roomId);
        console.log(`Room ${roomId} deleted - no players left`);
      } else {
        io.to(roomId).emit('player left', socket.id);
      }
    }
  });

  // Handle chat messages within a room
  socket.on('chat message', (data: { roomId: string, message: string }) => {
    io.to(data.roomId).emit('chat message', data.message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up rooms when players disconnect
    activeRooms.forEach((room, roomId) => {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        if (room.players.size === 0) {
          activeRooms.delete(roomId);
          console.log(`Room ${roomId} deleted - no players left`);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 