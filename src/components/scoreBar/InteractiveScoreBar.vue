<template>
  <div
    class="score-wrapper"
    @mousemove="onMouseMove"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <v-tooltip activator="parent" location="top">
      <template #activator="{ props: tooltipProps }">
        <v-progress-linear
          v-bind="tooltipProps"
          :model-value="animatedScore * 20"
          :color="barColor"
          height="36"
          rounded
          class="clickable-bar"
          @mousedown="onMouseDown"
          @click="onClick"
        >
          <div class="score-bar-content" ref="progressBar">
            <div class="score-tag">{{ animatedScore.toFixed(2) }}</div>
            <!--Ticks-->
            <div v-for="(tick, index) in tickPoints"
              :key="index"
              class="tick"
              :style="{ left: `${tick.left}%` }">
            </div>
          </div>
        </v-progress-linear>
      </template>
      <span>{{ animatedScore.toFixed(2) }}</span>
    </v-tooltip>

    <!-- Snackbar for showing popup -->
    <v-snackbar
      v-model="showPopup"
      :color="popupColor"
      timeout="2000"
      location="bottom right"
    >
      {{ popupMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Number,
});
const emit = defineEmits(['update:modelValue']);

const progressBar = ref(null);
const isDragging = ref(false);

// Animated score
const animatedScore = ref(0);

// Popup message and color
const showPopup = ref(false);
const popupMessage = ref('');
const popupColor = ref('primary');
const tickPoints = [
  {score: 1.5, left: (1.5/5) * 100},
  {score: 2.5, left: (2.5/5) * 100},
  {score: 3.5, left: (3.5/5) * 100},
  {score: 4.5, left: (4.5/5) * 100},
];

// Watch modelValue to update animated score
watch(
  () => props.modelValue,
  (newVal) => {
    animatedScore.value = typeof newVal === 'number' ? newVal : 0;
  },
  { immediate: true }
);

// Compute progress bar color
const barColor = computed(() => {
  const score = props.modelValue || 0;
  if (score < 1.5) return '#f44336';
  if (score < 2.5) return '#ff9800';
  if (score < 3.5) return '#2196f3';
  if (score < 4.5) return '#1976d2';
  return '#4caf50';
});

// Update score based on click position
function updateScore(clientX) {
  const rect = progressBar.value?.getBoundingClientRect?.();
  if (!rect) {
    console.warn('progressBar DOM not found');
    return;
  }

  const percent = (clientX - rect.left) / rect.width;
  const newScore = Math.min(5, Math.max(0, +(percent * 5).toFixed(2)));
  emit('update:modelValue', newScore);
}

// Handle click
function onClick(e) {
  updateScore(e.clientX);
}

// Handle mouse down (start dragging)
function onMouseDown(e) {
  isDragging.value = true;
  updateScore(e.clientX);
}

// Handle mouse move
function onMouseMove(e) {
  if (isDragging.value) updateScore(e.clientX);
}

// Handle mouse release
function stopDragging() {
  if (isDragging.value) {
    isDragging.value = false;

    if (typeof props.modelValue === 'number') {
      popupMessage.value = "Score updated";

      // Set popup color based on score
      const score = props.modelValue;
      if (score < 2) popupColor.value = 'error';
      else if (score < 3.5) popupColor.value = 'warning';
      else if (score < 4.5) popupColor.value = 'primary';
      else popupColor.value = 'success';

      showPopup.value = true;
    }
  }
}
</script>

<style scoped lang="scss">
.score-wrapper {
  position: relative;
  user-select: none;
  width: 100%;
}

.clickable-bar {
  cursor: pointer;
  transition: width 0.3s ease, background-color 0.5s ease;
  position: relative;
}

.score-bar-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.score-tag {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #f44336;
  color: white;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  pointer-events: none;
  transition: all 0.3s ease;
}
.tick {
  position: absolute;
  width: 2px;
  height: 16px;
  background: #333;
  top: -8px;
  border-radius: 2px;
  transform: translateX(-50%);
}
</style>
  