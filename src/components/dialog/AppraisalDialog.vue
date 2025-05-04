<script setup>
import { ref, reactive, watch } from 'vue';
import StepOne from '../forms/StepOne.vue';
import StepTwo from '../forms/StepTwo.vue';
import StepThree from '../forms/StepThree.vue';
import { debounce } from 'lodash';
import { saveScore,saveFeedback, saveSummaryDate, saveSummary } from '../../Services/api';
import { format } from 'date-fns';

const props = defineProps({
  show: Boolean,
  card: Object
});
const emit = defineEmits(['update:show']);

const token = import.meta.env.VITE_JWT_TOKEN;
const apiUrl = import.meta.env.VITE_API_URL;

const internalShow = ref(props.show);
const stepIndex = ref(0);
const completedSteps = ref([]);
const showSuccess = ref(false);

const steps = ['Dept/Individual Goals 100.00%', 'Summary CommentXX2', 'Mark Ready'];
const stepIcons = [
  'mdi-file-document-edit-outline',
  'mdi-comment-text-outline',
  'mdi-check-circle-outline'
];
const stepForms = [StepOne, StepTwo, StepThree];

const formData = reactive({
  position: '',
  department: '',
  score: 0,
  dates: [],
  finalComment: '',
  feedback: '',
  summaryDate: new Date(),
  summaryFormattedDate: '',
  summaryComment: '',
  commented: true,
  isMarked: false,
  completedBy: 'Cristin Ababa',
  timestamp: ''
});

// Watch to sync dialog visibility
watch(() => props.show, (val) => {
  internalShow.value = val;
});
watch(internalShow, (val) => {
  emit('update:show', val);
});

// Reset form
function resetForm() {
  formData.position = '';
  formData.department = '';
  formData.score = 0;
  formData.dates = [];
  formData.finalComment = '';
  formData.feedback = '';
  formData.summaryDate = new Date();
  formData.summaryFormattedDate = '';
  formData.summaryComment = '';
  formData.commented = true;
  formData.isMarked = false;
  formData.completedBy = 'Cristin Ababa';
  formData.timestamp = '';
  stepIndex.value = 0;
  completedSteps.value = [];
}

function closeDialog() {
  internalShow.value = false;
  resetForm();
}

// Validate all steps
function revalidateAllSteps() {
  completedSteps.value = [];

  if (formData.score && formData.feedback) {
    completedSteps.value.push(0);
  }
  if (formData.summaryComment && formData.summaryFormattedDate) {
    completedSteps.value.push(1);
  }
  if (formData.isMarked) {
    completedSteps.value.push(2);
  }
}

// Live revalidate while typing
watch(
  () => [formData.score, formData.feedback],
  () => {
    revalidateAllSteps();
  }
);
watch(
  () => [formData.summaryComment, formData.summaryFormattedDate],
  () => {
    revalidateAllSteps();
  }
);
watch(
  () => formData.isMarked,
  () => {
    revalidateAllSteps();
  }
);

// Handle Next button
function handleValidated() {
  revalidateAllSteps();
  if (stepIndex.value < stepForms.length - 1) {
    stepIndex.value++;
  } else {
    showSuccess.value = true;
    closeDialog();
  }
}

// Handle Back button
function handleBack() {
  revalidateAllSteps();
  if (stepIndex.value > 0) {
    stepIndex.value--;
  }
}

// Handle breadcrumb click
function goToStep(index) {
  revalidateAllSteps();
  stepIndex.value = index;
}

// Debounced saveScore function
const saveScoree = debounce(async (newScore) => {
  if (newScore !== null && newScore !== '') {
    try {
      const res =  await saveScore(newScore).then((res) => {
        return res.data;
      });
      
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  }
}, 3000); // Debounce delay 300ms

// Debounced saveFeedback function
const saveFeeedback = debounce(async (newFeedback) => {
  if (newFeedback !== null && newFeedback !== '') {
    try {
      const res =  await saveFeedback(newFeedback).then((res) => {
        return res.data;
      });
      
    } catch (error) {
      console.error('Failed to update Feedback:', error);
    }
  }
}, 3000); // Debounce delay 300ms

// Debounced saveSummaryDate function
const saveSummaryDates = debounce(async (newdate) => {
  const formatedDate = format(newdate, 'yyyy-MM-dd');
  if (newdate !== null && newdate !== '') {
    try {
      const res =  await saveSummaryDate(formatedDate).then((res) => {
        return res.data;
      });
    } catch (error) {
      console.error('Failed to update newdate:', error);
    }
  }
}, 100); // Debounce delay 100ms

// Debounced saveSummaryDate function
const saveSummaryComment = debounce(async (newSummary) => {
  if (newSummary !== null && newSummary !== '') {
    try {
      const res =  await saveSummary(newSummary).then((res) => {
        return res.data;
      });
    } catch (error) {
      console.error('Failed to update newSummary:', error);
    }
  }
}, 300); // Debounce delay 300ms

// Watch the score field
watch(
  () => formData.score,
  (newScore) => {
    saveScore(newScore);
},
);
watch(
  () => formData.feedback,
  (newFeedback) => {
    saveFeeedback(newFeedback);
},
);
watch(
  () => formData.summaryFormattedDate,
  (newdate) => {
    console.log('newdate:', newdate);
    saveSummaryDates(newdate);
},
);
watch(
  () => formData.summaryComment,
  (newComment) => {
    saveSummaryComment(newComment);
},
);

</script>

<template>
  <v-dialog v-model="internalShow" persistent max-width="100%" scrollable @click:outside="closeDialog">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <v-icon></v-icon>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Stepper -->
        <div class="stepper-container">
  <div class="stepper-wrapper">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step-wrapper"
      :class="{ active: stepIndex === index, completed: completedSteps.includes(index) }"
      @click="goToStep(index)"
    >
      <div class="step-circle">
        <v-icon v-if="completedSteps.includes(index)">mdi-check</v-icon>
        <v-icon v-else>{{ stepIcons[index] }}</v-icon>
      </div>
      <div class="step-label" :class="{'active-label': stepIndex === index}">{{ step }}</div>
    </div>

    <!-- Connectors -->
    <div
      v-for="(step, index) in steps.slice(0, -1)"
      :key="'conn-' + index"
      class="step-connector"
      :class="{ completed: completedSteps.includes(index + 1) }"
      :style="{ left: `${(index + 1) * 100 / steps.length}%` }"
    ></div>
  </div>
</div>

        <!-- Step Content -->
        <div class="step-content mt-6">
          <component
            :is="stepForms[stepIndex]"
            :form="formData"
            @validated="handleValidated"
            @back="handleBack"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Snackbar After Finish -->
    <v-snackbar v-model="showSuccess" timeout="3000" color="success" location="bottom right">
      Appraisal Completed Successfully!
    </v-snackbar>
  </v-dialog>
</template>

<style scoped>
.stepper-container {
  margin-bottom: 24px;
}
.stepper-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  position: relative;
}
.step-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  position: relative;
}
.step-circle {
  background: #e0e0e0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background 0.3s ease;
}
.step-wrapper.active .step-circle {
  background: #1976d2;
  color: white;
}
.step-wrapper.completed .step-circle {
  background: #4caf50;
  color: white;
}
.step-label {
  font-size: 13px;
  margin-top: 6px;
  text-align: center;
}
.step-connector {
  position: absolute;
  top: 18px;
  height: 4px;
  width: calc(100% / 3 - 36px);
  background: #cfd8dc;
  z-index: 0;
  transform: translateX(-50%);
  transition: background 0.3s ease;
}
.step-connector.completed {
  background: #4caf50;
}
.step-content {
  margin-top: 24px;
}
.step-label {
  font-size: 14px;
  margin-top: 6px;
  font-weight: normal;
  color: #455a64;
  text-align: center;
  width: 30%;
  &.active-label {
    font-weight: bolder;
  }
}
</style>