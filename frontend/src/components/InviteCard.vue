<template>
  <div class="invite-card">
    <div class="invite-card-inner">
      <div class="invite-url-row">
        <span class="invite-url-label">{{ inviteUrl }}</span>
        <button class="copy-btn" @click="copyUrl">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
    </div>
    <div class="invite-message">Share this link with your friend to play</div>
    <button class="go-home-btn" @click="$emit('leave')">Go to home</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  roomId: string | null;
}>();

defineEmits(['leave']);

const inviteUrl = computed(() => {
  if (!props.roomId) return 'Creating room...';
  return `${window.location.origin}?room=${props.roomId}`;
});

function copyUrl() {
  if (props.roomId) {
    navigator.clipboard.writeText(inviteUrl.value);
  }
}
</script>

<style scoped>
.invite-card {
  border: 2px solid #5a3a3a;
  border-radius: 28px;
  padding: 32px 24px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Excalifont', Arial, sans-serif;
}
.invite-card-inner {
  border: 2px solid #5a3a3a;
  border-radius: 18px;
  padding: 12px 24px;
  width: 100%;
  max-width: 420px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.invite-url-row {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
.invite-url-label {
  font-size: 2em;
  color: #e0c9a6;
  font-family: 'Excalifont', Arial, sans-serif;
}
.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #e0c9a6;
  padding: 0 0 0 12px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.copy-btn:hover {
  color: #f5e5c5;
}
.invite-message {
  margin: 18px 0 24px 0;
  font-size: 1.5em;
  color: #e0c9a6;
  text-align: center;
  font-family: 'Excalifont', Arial, sans-serif;
}
.go-home-btn {
  font-family: 'Excalifont', Arial, sans-serif;
  font-size: 2.5em;
  background: none;
  color: #d2a05b;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  transition: color 0.2s;
}
.go-home-btn:hover {
  color: #f5e5c5;
}
</style> 