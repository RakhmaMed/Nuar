<template>
  <div class="card">
    <h2 class="card-title">{{ title }}</h2>
    <p class="card-description">{{ description }}</p>
    <button class="card-play-button" @click="$emit('play')">Play</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

defineEmits(['play']);
</script>

<style scoped>
.card {
  background-color: transparent; /* Remove the dark brown background */
  border: 2px solid #5a3a3a; /* Keep the border */
  border-radius: 15px;
  padding: 20px;
  margin: 15px;
  width: calc(50% - 30px); /* Two cards per row, considering margin */
  box-sizing: border-box;
  color: #e0c9a6; /* Light beige/tan text color */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  text-align: center; /* Center text */
}

.card-title {
  font-size: 1.5em;
  margin-top: 0;
  margin-bottom: 10px;
  color: #f5e5c5; /* Lighter color for title */
  border-bottom: 1px dashed #5a3a3a;
  padding-bottom: 5px;
  width: 100%;
}

.card-description {
  font-size: 0.9em;
  line-height: 1.4;
  margin-bottom: 20px;
  min-height: 60px; /* Ensure consistent height for description area */
}

.card-play-button {
  background-color: transparent;
  color: #e0c9a6;
  border: none;
  padding: 10px 20px;
  font-size: 1.2em;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-top: auto; /* Push button to the bottom */
}

.card-play-button:hover {
  color: #ffffff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    width: calc(100% - 30px); /* Single card per row on smaller screens */
  }
}
</style>