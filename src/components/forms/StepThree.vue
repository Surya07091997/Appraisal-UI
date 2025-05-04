<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const emit = defineEmits(['validated', 'back']);
const props = defineProps({ form: Object });

// Compute if form is completely valid
const isValid = computed(() => {
  return (
    props.form.score &&
    props.form.feedback &&
    props.form.summaryComment &&
    props.form.summaryFormattedDate
  );
});

function markAsReady() {
  props.form.isMarked = true;
  const now = new Date();
  props.form.timestamp = now.toLocaleDateString('en-US') + ' ' + now.toLocaleTimeString('en-US');
}

function validate() {
  emit('validated');
}
</script>

<template>
  <v-container class="step-three-wrapper">
    <!-- Title -->
    <h2 class="form-title text-primary">AppraisalX1 Checklist</h2>
    <p class="form-subtitle text-caption mb-6">
      Review each AppraisalX1 section below to ensure all requirements are met before marking ready for meeting.<br />
      <em>Note: Optional comments that are left blank will be displayed on the checklist as a checkmark with an asterisk.</em>
    </p>

    <!-- Warning Box -->
    <v-alert
      v-if="!isValid"
      type="warning"
      variant="outlined"
      class="warning-box my-6"
      prominent
      icon="mdi-alert-circle-outline"
    >
      <strong>Complete the following required fields before marking ready:</strong>
      <ul class="mt-2">
        <li v-if="!props.form.summaryFormattedDate">
          <v-icon size="small" color="error">mdi-close</v-icon>
          Summary CommentsX1 Date: Missing Date
        </li>
        <li v-if="!props.form.summaryComment">
          <v-icon size="small" color="error">mdi-close</v-icon>
          Summary CommentsX1: Missing Comments
        </li>
        <li v-if="!props.form.score">
          <v-icon size="small" color="error">mdi-close</v-icon>
          Dept/Individual Goal: Missing Score
        </li>
        <li v-if="!props.form.feedback">
          <v-icon size="small" color="error">mdi-close</v-icon>
          Dept/Individual Goal: Missing Comments
        </li>
      </ul>
    </v-alert>

    <!-- Section 1 -->
    <h3 class="section-title">Dept/Individual Goal</h3>
    <v-card class="pa-3 mb-4">
      <v-row class="header-row font-weight-bold text-caption pa-2">
        <v-col cols="8">NAME</v-col>
        <v-col cols="2" class="text-center">SCORE</v-col>
        <v-col cols="2" class="text-center">COMMENTS</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="body-row pa-2">
        <v-col cols="8">AAAAAAAA</v-col>
        <v-col cols="2" class="text-center">
          <v-icon v-if="props.form.score" color="success">mdi-check</v-icon>
          <v-icon v-else color="error">mdi-close</v-icon>
        </v-col>
        <v-col cols="2" class="text-center">
          <v-icon v-if="props.form.feedback" color="success">mdi-check</v-icon>
          <v-icon v-else color="error">mdi-close</v-icon>
        </v-col>
      </v-row>
    </v-card>

    <!-- Section 2 -->
    <h3 class="section-title">Summary CommentsX1</h3>
    <v-card class="pa-3 mb-4">
      <v-row class="header-row font-weight-bold text-caption pa-2">
        <v-col cols="10">NAME</v-col>
        <v-col cols="2" class="text-center">COMMENTS</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="body-row pa-2">
        <v-col cols="10">
          <div class="font-weight-medium">Summary Comments1 Date</div>
        </v-col>
        <v-col cols="2" class="text-center">
          <v-icon v-if="props.form.summaryFormattedDate" color="success">mdi-check</v-icon>
          <v-icon v-else color="error">mdi-close</v-icon>
        </v-col>
        <v-col cols="10">
          <div class="font-weight-medium">Summary Comments1</div>
        </v-col>
        <v-col cols="2" class="text-center">
          <v-icon v-if="props.form.summaryComment" color="success">mdi-check</v-icon>
          <v-icon v-else color="error">mdi-close</v-icon>
        </v-col>
      </v-row>
    </v-card>

    <!-- Mark Ready Section -->
    <v-card class="mark-ready-card pa-4 mb-6 text-center">
      <v-btn
        :disabled="!isValid || props.form.isMarked"
        color="primary"
        class="mb-2"
        @click="markAsReady"
      >
        <v-icon v-if="props.form.isMarked" left>mdi-check</v-icon>
        {{ props.form.isMarked ? 'Ready For Meeting' : 'Mark Ready For Meeting' }}
      </v-btn>

      <div class="status-text mt-2">
        <template v-if="!isValid">
          The AppraisalX1 cannot be marked ready for meeting until all required fields are completed.
        </template>
        <template v-else-if="props.form.isMarked">
          Completed by {{ props.form.completedBy }} ({{ props.form.timestamp }})
        </template>
        <template v-else>
          Your next step is to mark the AppraisalX1 "Ready for Meeting".
        </template>
      </div>
    </v-card>

    <!-- Navigation -->
    <div class="action-buttons">
      <div style="flex-grow: 1"></div>
      <v-btn variant="text" class="back-link" @click="$emit('back')">Back</v-btn>
      <v-btn color="primary" @click="validate">Next: View Full Appraisal</v-btn>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.step-three-wrapper {
  max-width: 900px;
  margin: 0 auto;
}
.form-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 8px;
}
.form-subtitle {
  font-size: 14px;
  color: #555;
}
.section-title {
  font-weight: 700;
  font-size: 18px;
  margin-top: 24px;
  margin-bottom: 8px;
  color: #333;
}
.warning-box {
  background-color: #fff8e1 !important;
  border-left: 5px solid #ff9800;
  color: #8c6d1f;
  padding: 16px;
  border-radius: 8px;
}
.mark-ready-card {
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  padding: 24px;
}
.status-text {
  background-color: #bbdefb;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #0d47a1;
  margin-top: 12px;
}
ul {
  list-style-type: none;
  padding-left: 20px;
  margin-top: 8px;
}
li {
  margin-bottom: 6px;
}
.action-buttons {
  display: flex;
  align-items: center;
  margin-top: 24px;
}
.back-link {
  text-decoration: none;
  color: #1976d2;
  font-weight: normal;
  font-size: 14px;
  text-transform: none;
}
.back-link:hover {
  text-decoration: underline;
}
.v-icon {
  font-size: 22px;
}
.v-card {
  border: 1px solid #e0e0e0;
  box-shadow: 0px 1px 4px rgba(0,0,0,0.08);
  border-radius: 8px;
}
</style>