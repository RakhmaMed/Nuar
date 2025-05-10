<template>
  <div id="app-container">
    <header class="app-header" v-if="!showInviteCard">
      <h1 class="app-title">Noir</h1>
      <div class="language-switcher">
        <span>English</span> / <span>Russian</span>
      </div>
    </header>
    <main class="game-modes-grid" v-if="!showInviteCard">
      <DescriptionCard
        v-for="card in gameModes"
        :key="card.title"
        :title="card.title"
        :description="card.description"
        @play="openInviteCard(card.title)"
      />
    </main>
    <div v-else style="display: flex; flex-direction: column; align-items: center;">
      <InviteCard :room-id="currentRoomId" @leave="leaveRoom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import DescriptionCard from '../components/DescriptionCard.vue';
import InviteCard from '../components/InviteCard.vue';
import { socketService } from '../services/socket';
import { useRouter } from 'vue-router';

interface GameMode {
  title: string;
  description: string;
}

const gameModes = ref<GameMode[]>([
  {
    title: 'Bandit vs Inspector',
    description: 'Play a deadly cat-and-mouse game and hunt down the bandit before he gets to you.',
  },
  {
    title: 'Killer vs Detective',
    description: 'The killer eliminates people from the list, and the detective tries to neutralize him.',
  },
  {
    title: 'Spy games',
    description: 'Find and catch the other spies before they catch you.',
  },
  {
    title: 'Virtuoso thief vs Police Chief',
    description: 'A virtuoso thief robs everyone who gets his hands on, but the chief of police himself is relentlessly on his trail.',
  },
  {
    title: 'FBI vs Mafia',
    description: 'A team game in which FBI agents catch mobsters who have decided that the city belongs to them.',
  },
  {
    title: 'The heist of the century',
    description: 'A group of thieves is trying to rob the casino\'s vault, and the security chief is trying to stop them.',
  },
]);

const showInviteCard = ref(false);
const currentRoomId = ref<string | null>(null);
const router = useRouter();

async function openInviteCard(gameMode: string) {
  try {
    // Find the game mode object to get the title
    const selectedGameMode = gameModes.value.find(mode => mode.title === gameMode);
    if (!selectedGameMode) {
      throw new Error('Game mode not found');
    }
    const roomId = await socketService.createRoom(selectedGameMode.title);
    currentRoomId.value = roomId;
    showInviteCard.value = true;
  } catch (error) {
    console.error('Failed to create room:', error);
    // Handle error (you might want to show an error message to the user)
  }
}

function leaveRoom() {
  if (currentRoomId.value) {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('leave room', currentRoomId.value);
    }
  }
  showInviteCard.value = false;
  currentRoomId.value = null;
  router.push({ name: 'home' });
}

// Socket.IO setup
onMounted(() => {
  const socket = socketService.connect();
  
  // Check for room parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room');
  
  if (roomId) {
    // If room ID is in URL, join the room
    socketService.joinRoom(roomId).then(() => {
      currentRoomId.value = roomId;
      showInviteCard.value = true;
    }).catch(error => {
      console.error('Failed to join room:', error);
      // Handle error (you might want to show an error message to the user)
    });
  }
  
  socket?.on('chat message', (message) => {
    console.log('Received message:', message);
    // Handle incoming messages here
  });

  socket?.on('player joined', (playerId: string) => {
    console.log('Player joined:', playerId);
    // Navigate to board when second player joins
    if (currentRoomId.value) {
      router.push({ name: 'board', params: { roomId: currentRoomId.value } });
    }
  });

  // Handle player leaving
  socket?.on('player left', (playerId: string) => {
    console.log('Player left:', playerId);
    // If we're in the invite card view and the other player left, stay on the invite card
    // If we're in the board view and the other player left, we'll handle that in the Board component
  });
});

onUnmounted(() => {
  // Don't disconnect, just leave the room if we're in one
  if (currentRoomId.value) {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('leave room', currentRoomId.value);
    }
  }
});
</script>

<style scoped>
#app-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.go-home-btn {
  font-family: 'Excalifont', Arial, sans-serif;
  font-size: 1.5em;
  margin-top: 32px;
  padding: 12px 32px;
  background: none;
  color: #e0c9a6;
  border: 2px solid #5a3a3a;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.go-home-btn:hover {
  background: #e0c9a6;
  color: #1a1a1a;
}
</style> 