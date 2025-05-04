<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import InteractiveScoreBar from '../scoreBar/InteractiveScoreBar.vue';
import RatingTiles from '../tiles/RatingTiles.vue';

const emit = defineEmits(['validated', 'back']);
const props = defineProps({ form: Object });

const isValid = computed(() => {
  return props.form.score !== null && props.form.score !== '';
});

function validate() {
  emit('validated');
}
</script>

<template>
  <v-card class="pa-4 appraisal-card">
    <!-- Title and Description -->
    <div class="header mb-4">
      <h2 class="font-weight-bold">
         <span class="text-primary">AAAAAAAA 100%</span>
      </h2>
      <p class="text-muted">Test Description New</p>
    </div>

    <!-- Progress Info -->
    <div class="progress-info d-flex justify-space-between mb-2">
      <h3>Your Dept/Individual Goal Progress: 0%</h3>
      <h3>AppraiserX1 Dept/Individual Goal Progress: 0%</h3>
    </div>

    <!-- Interactive Score Bar -->
    <interactive-score-bar v-model="props.form.score" />

    <!-- Rating Tiles Section -->
    <div class="ratings-grid mt-6">
      <rating-tiles :score="props.form.score" />
    </div>

    <!-- Employee Comment Section -->
    <div class="textarea-section mt-6">
      <h4 class="font-weight-bold">EmployeeX1 CommentX1 - Cristin Ababa</h4>
      <v-textarea 
        v-model="props.form.feedback"
        placeholder="Type your comment here..."
        variant="outlined"
        rows="3"
        auto-grow
        class="mt-3"
      />
    </div>

    <!-- Navigation Buttons -->
    <div class="action-buttons">
      <div style="flex-grow: 1"></div>
      <v-btn variant="text" color="primary" class="back-line" @click="$emit('back')">Back</v-btn>
      <v-btn :disabled="!isValid" color="primary" @click="validate">Next: Summary CommentsXX2</v-btn>
    </div>
  </v-card>
</template>

<style scoped lang="scss">

.appraisal-card {
  background: #fff;
  border-radius: 12px;
  border: none !important;
  box-shadow: none !important;
}

.header {
  text-align: left;
}

.progress-info {
  font-size: 13px;
  color: #555;
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.textarea-section {
  margin-top: 20px;
}
.action-buttons {
  display: flex;
  align-items: center;
  margin-top: 24px;
}
.back-line{
  font-weight: normal;
  text-transform: none;
  font-size: 14px;
  background-color: transparent !important;
  &:hover {
    text-decoration: underline;
    background-color: transparent !important;
    box-shadow: none !important;
  }
}
</style>