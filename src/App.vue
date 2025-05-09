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
        @play="openInviteCard"
      />
    </main>
    <div v-else style="display: flex; flex-direction: column; align-items: center;">
      <InviteCard />
      <button class="go-home-btn" @click="showInviteCard = false">Go to home</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DescriptionCard from './components/DescriptionCard.vue';
import InviteCard from './components/InviteCard.vue';

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
function openInviteCard() {
  showInviteCard.value = true;
}
</script>

<style scoped>
/* Styles specific to App.vue can go here if needed in the future */
/* For now, all global styles are in src/style.css */
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
