<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { format } from 'date-fns';

const emit = defineEmits(['validated', 'back']);
const props = defineProps({ form: Object });

const dateMenu = ref(false);

const isValid = computed(() => props.form.summaryComment && props.form.summaryFormattedDate);

function onDateSelect(val) {
  props.form.summaryFormattedDate = format(val, 'MM/dd/yyyy');
  props.form.summaryDate = val;
  dateMenu.value = false;
}

function validate() {
  emit('validated');
}
</script>

<template>
  <v-card class="no-border-card pa-4">
    <!-- Title and Description -->
    <div class="header mb-4">
      <h2 class="font-weight-bold">
         <span class="text-primary">Summary CommentsXX2</span>
      </h2>
      <h3>
        <span class="text-primary">EmployeeX1 - Cristin Ababa</span>
      </h3>
    </div>

    <div class="progress-info d-flex justify-space-between mb-2">
      <h3>Summary Comments1*</h3>
    </div>

    <v-menu transition="scale-transition" v-model="dateMenu">
      <template #activator="{ props: menuProps }">
        <v-text-field
          v-bind="menuProps"
          v-model="props.form.summaryFormattedDate"
          placeholder="Summary Date*"
          readonly
          variant="outlined"
          max-width="50%"
          append-inner-icon="mdi-calendar"
        />
      </template>
      <v-date-picker v-model="props.form.summaryDate" @update:model-value="onDateSelect" />
    </v-menu>
    
    <div class="progress-info d-flex justify-space-between mb-2">
      <h3>Comments</h3>
    </div>
    <v-text-field v-model="props.form.summaryComment" max-width="90%" variant="outlined" class="small-textfield" Placeholder="Summary Comment*" />

    <div class="action-buttons">
      <div style="flex-grow: 1"></div>
      <v-btn variant="text" color="primary" class="back-line" @click="$emit('back')">Back</v-btn>
      <v-btn :disabled="!isValid" color="primary" @click="validate">Next: Mark Ready</v-btn>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.no-border-card {
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
.summary-comments {
  background-color: #fff;
  border-radius: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.form-title {
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 4px;
}

.employee-name {
  font-size: 16px;
  margin-bottom: 24px;
}

.language-check {
  font-size: 14px;
  color: #444;
  margin-top: 16px;
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
  &:hover {
    background-color: white !important;
    text-decoration: underline;
  }
}
.small-textfield {
 .v-field__input{
  background-color: white !important;
  min-height: 36px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 14px;
 }
 .v-label{
  font-size: 13px;
 }
}
</style>