<template>
  <div class="board-container">
    <div class="board-header">
      <span class="board-title">{{ gameMode }}</span>
    </div>
    <div class="board-main">
      <div class="board-grid-wrapper">
        <!-- Top triangles -->
        <div class="triangle-row top">
          <button v-for="col in 5" :key="'top-' + col" class="triangle-btn up" @click="onTriangleClick('up', col - 1)"></button>
        </div>
        <div class="board-grid-rows">
          <div v-for="row in 5" :key="'row-' + row" class="board-row">
            <!-- Left triangle -->
            <button class="triangle-btn left" @click="onTriangleClick('left', row - 1)"></button>
            <!-- Images -->
            <img
              v-for="col in 5"
              :key="'img-' + ((row - 1) * 5 + col)"
              :src="`/img/person${(row - 1) * 5 + col}.jpeg`"
              class="board-img"
              :alt="`Person ${(row - 1) * 5 + col}`"
            />
            <!-- Right triangle -->
            <button class="triangle-btn right" @click="onTriangleClick('right', row - 1)"></button>
          </div>
        </div>
        <!-- Bottom triangles -->
        <div class="triangle-row bottom">
          <button v-for="col in 5" :key="'bottom-' + col" class="triangle-btn down" @click="onTriangleClick('down', col - 1)"></button>
        </div>
      </div>
      <div class="board-logs">
        <span class="logs-title">Game logs</span>
        <!-- Game logs content here -->
      </div>
    </div>
    <div class="board-status-bar">
      Status bar
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { socketService } from '../services/socket';

const route = useRoute();
const showBoard = ref(false);
const playersInRoom = ref<string[]>([]);
const gameMode = ref<string>('');

onMounted(() => {
  const socket = socketService.connect();
  const roomId = route.params.roomId;

  if (typeof roomId === 'string') {
    socketService.joinRoom(roomId).then(() => {
      console.log('Joined room:', roomId);
    });
  }

  socket?.on('player joined', (playerId: string) => {
    if (!playersInRoom.value.includes(playerId)) {
      playersInRoom.value.push(playerId);
    }
    if (playersInRoom.value.length >= 2) {
      showBoard.value = true;
    }
  });

  socket?.on('room joined', (data: { roomId: string, gameMode: string }) => {
    // Add self to players list
    if (socket?.id && !playersInRoom.value.includes(socket.id)) {
      playersInRoom.value.push(socket.id);
    }
    gameMode.value = data.gameMode;
  });

  // Handle player leaving
  socket?.on('player left', (playerId: string) => {
    const index = playersInRoom.value.indexOf(playerId);
    if (index !== -1) {
      playersInRoom.value.splice(index, 1);
    }
    if (playersInRoom.value.length < 2) {
      showBoard.value = false;
    }
  });
});

onUnmounted(() => {
  // Don't disconnect, just leave the room
  const socket = socketService.getSocket();
  const roomId = route.params.roomId;
  if (socket && typeof roomId === 'string') {
    socket.emit('leave room', roomId);
  }
});

function onTriangleClick(direction: string, index: number) {
  // Handle triangle button click
  // direction: 'up', 'down', 'left', 'right'
  // index: 0-4 (column or row)
  console.log('Triangle clicked:', direction, index);
}
</script>

<style scoped>
.board-container {
  background: #181616;
  border: 2px solid #3a2323;
  border-radius: 24px;
  padding: 24px;
  color: #f5e5c5;
  font-family: 'Excalifont', Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
}
.board-header {
  text-align: left;
  margin-bottom: 12px;
}
.board-title {
  font-size: 2.5em;
  font-family: 'Excalifont', Arial, sans-serif;
  color: #f5e5c5;
  margin-left: 12px;
}
.board-main {
  display: flex;
  flex-direction: row;
  gap: 32px;
}
.board-grid-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #181616;
  border: 2px solid #3a2323;
  border-radius: 18px;
  padding: 18px 18px 0 18px;
}
.triangle-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 4px;
}
.triangle-row.bottom {
  margin-top: 4px;
  margin-bottom: 0;
}
.board-grid-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.board-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}
.board-img {
  width: 48px;
  height: 48px;
  border: 2px solid #bdbdbd;
  border-radius: 10px;
  background: #181616;
  object-fit: cover;
  margin: 0 2px;
  box-shadow: 0 0 0 2px #bdbdbd, 0 0 0 4px #181616;
}
.triangle-btn {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.triangle-btn.up::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 16px solid #bdbdbd;
}
.triangle-btn.down::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 16px solid #bdbdbd;
}
.triangle-btn.left::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 16px solid #bdbdbd;
}
.triangle-btn.right::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 16px solid #bdbdbd;
}
.board-logs {
  flex: 1;
  background: #181616;
  border: 2px solid #3a2323;
  border-radius: 18px;
  margin-left: 12px;
  padding: 18px;
  min-width: 260px;
  max-width: 340px;
  min-height: 420px;
  color: #f5e5c5;
  font-family: 'Excalifont', Arial, sans-serif;
}
.logs-title {
  font-size: 2em;
  color: #f5e5c5;
  font-family: 'Excalifont', Arial, sans-serif;
  margin-bottom: 18px;
  display: block;
}
.board-status-bar {
  margin-top: 24px;
  background: #181616;
  border: 2px solid #3a2323;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  font-size: 1.5em;
  color: #e0c9a6;
  font-family: 'Excalifont', Arial, sans-serif;
}
</style> 