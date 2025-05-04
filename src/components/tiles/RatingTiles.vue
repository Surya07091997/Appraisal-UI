<template>
    <div class="ratings-grid">
      <div
        v-for="(tile, index) in tiles"
        :key="index"
        class="rating-tile"
        :class="{ active: isActive(index) }"
        :style="isActive(index) ? { borderColor: titleColors[index] } : {}"
      >
      <div class="rating-title-header" :style="isActive(index) ? { color: titleColors[index] } : {}">
        <div class="rating-title-body">
        <div class="title">{{ tile.label }}</div>
        <div class="subtitle">{{ tile.desc }}</div>
      </div>
      </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    score: Number,
  });
  
  const tiles = [
    { label: 'Unacceptable', desc: 'Needs great improvement' },
    { label: 'Unsatisfactory', desc: 'Needs improvement' },
    { label: 'Good Solid Performance', desc: 'Meets Standards' },
    { label: 'Excellent', desc: 'Going above and beyound1' },
    { label: 'Level 5 Entry', desc: 'Level5 entry now' },
  ];
  
  function isActive(index) {
    const s = props.score;
    if (index === 0) return s < 1.5;
    if (index === 1) return s >= 1.5 && s < 2.5;
    if (index === 2) return s >= 2.5 && s < 3.5;
    if (index === 3) return s >= 3.5 && s < 4.5;
    if (index === 4) return s >= 4.5;
    return false;
  }
  
  const titleColors = [
    '#f44336', // Red
    '#ff9800', // Orange
    '#2196f3', // Blue
    '#1976d2', // Dark Blue
    '#4caf50', // Green
  ];
  </script>
  
  <style scoped lang="scss">
  .ratings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-top: 32px;
  }
  
  .rating-tile {
    background: white;
    padding: 0px;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid #ccc;
    transition: all 0.3s ease;
    overflow: hidden;
    height: 5rem;
  }
  .title{
    font-size: 16px;
    font-weight: bold;
  }
  .subtitle{
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }
  </style>