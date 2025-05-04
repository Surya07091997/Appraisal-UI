import axios from 'axios';

// Load API URL from .env
const API_URL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_JWT_TOKEN;

// Create Axios instance without hardcoding Authorization
const apiClient = axios.create({
  baseURL: API_URL
});

// Dynamically attach Bearer token before every request
apiClient.interceptors.request.use((config) => {
  const accessToken = token // or wherever you store the token
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- API Functions ---

// Save Score
export async function saveScore(score) {
    console.log("Saving score:", score);
  return apiClient.put(`${API_URL}/api/appraisal/1/score`, { score });
}

// Save Feedback (optional if you have this API)
export async function saveFeedback(feedback) {
  return apiClient.put(`${API_URL}/api/appraisal/1/feedback`, { feedback });
}

// Save Summary Comments
export async function saveSummary(summaryComment) {
  return apiClient.put(`${API_URL}/api/appraisal/1/summary-comment`, {
    summaryComment
  });
}

export async function saveSummaryDate(summaryDate) {
    console.log("Saving summary date:", summaryDate);
  return apiClient.put(`${API_URL}/api/appraisal/1/summary-date`, {
    summaryDate
  });
}

// Submit Final Appraisal
export async function submitFinal(isMarked, completedBy, timestamp) {
  return apiClient.put(`${API_URL}/api/appraisal/1/submit`, {
    isMarked,
    completedBy,
    timestamp
  });
}


export async function getCards() {
    return apiClient.get(`${API_URL}/api/appraisal/cards`);
}
