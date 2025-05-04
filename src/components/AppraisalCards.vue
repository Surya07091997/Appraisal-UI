<script setup>
import { onMounted, ref } from 'vue';
import AppraisalDialog from './dialog/AppraisalDialog.vue';
import axios from 'axios';
import { getCards } from '../Services/api';

const cards = ref([]);
const error = ref('');
const dialog = ref(false);
const selectedCard = ref(null)

onMounted(async () => {
  try {
    const res = await getCards();
    cards.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch cards';
    console.error(err);
  }
});
function openCard(card) {
  selectedCard.value = card;
  dialog.value = true;
}
</script>

<template>
  <v-container fluid>
    <v-row justify="center" class="py-4">
      <v-col
        v-for="(card, index) in cards"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="border-card" elevation="2">
          <!-- Top icons -->
          <v-card-title class="d-flex justify-space-between align-center py-1 px-3">
            <v-icon size="30" color="grey-darken-1">mdi-file-pdf-box</v-icon>

            <v-btn class="open-btn" variant="text" @click="openCard(card)" style="font-size: 13px; text-transform: none; min-width: 0;">
              <v-icon small>mdi-folder-open</v-icon>
              <span class="ml-1">OPEN</span>
            </v-btn>
          </v-card-title>

           <!-- Avatar-->     
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <v-icon size="100" color="black" class="avatar-placeholder">mdi-account</v-icon>
            </div>   
          </div>

          <!-- Card Content -->
          <v-card-text class="text-center px-4 card-content">
            <div class="font-weight-bold name-text">{{ card.name }}</div>
            <div class="subtitle-text mb-2">{{ card.title }}</div>
            <v-divider class="my-3"></v-divider>
            <div v-if="card.position" class="small-text mb-1"><strong>Position:</strong> {{ card.position }}</div>
            <div v-if="card.dateRange" class="small-text mb-1"><strong>Date Range:</strong> {{ card.dateRange }}</div>
            <div v-if="card.dueDate" class="small-text mb-1">
              <strong>Due Date:</strong> 
              <span :class="{ 'text-red': card.overdue }">{{ card.dueDate }}</span>
            </div>
            <div v-if="card.score" class="small-text mb-1"><strong> Score:</strong> {{ card.score }}</div>

            <div v-if="card.overdue == true" class="view-link mt-2">View Overall Weights</div>
          </v-card-text>

          <!-- Full Width Banner -->
          <div class="status-banner" :class="card.status.toLowerCase()">
            STATUS: {{ card.status }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <AppraisalDialog v-model:show="dialog" :card="selectedCard" />
  </v-container>
</template>


<style scoped lang="scss">
.border-card {
  position: relative; /* Important to let avatar go outside */
  border: 1px solid #ccc;
  border-radius: 10px;
  min-height: 430px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  overflow: visible; /* Allow avatar overflow */
}

.border-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px) scale(1.02);
}
.card-content {
  padding-top: 81px !important; 
}
.avatar-wrapper {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}
.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ccc;
}

.name-text {
  font-size: 18px;
  font-weight: bold;
}

.subtitle-text {
  font-size: 14px;
  color: #777;
  margin-top: 2px;
  margin-bottom: 8px;
}

.small-text {
  font-size: 13px;
  color: #555;
}

.view-link {
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  color: #1976d2;
  transition: color 0.3s;
}

.view-link:hover {
  color: #0d47a1;
}

/* Banner Status Bar */
.status-banner {
  padding: 10px 0;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.status-banner.current {
  background-color: #1976d2; /* Blue */
}

.status-banner.overdue {
  background-color: #d32f2f; /* Red */
}

.text-red {
  color: red;
}
</style>