// src/utils/apiPaths.js
// export const API_BASE_URL = 'https://interview-preparation-app.onrender.com/api';
export const API_BASE_URL = 'http://localhost:5000/api';

export const API = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  INTERVIEW: {
    GET_ALL: `${API_BASE_URL}/interview`,
    CREATE: `${API_BASE_URL}/interview`,
    GET_ONE: (sessionId) => `${API_BASE_URL}/interview/${sessionId}`,
    DELETE: (sessionId) => `${API_BASE_URL}/interview/${sessionId}`,
    ASK_AI: `${API_BASE_URL}/interview/ask`, // ✅ ADD THIS
    GENERATE_MORE: (sessionId) => `${API_BASE_URL}/interview/generate-more/${sessionId}`, // ✅ IF you're adding more Qs
    SUMMARIZE: `${API_BASE_URL}/interview/summarize`, // ✅
    VERIFY_DELETE_OTP: `${API_BASE_URL}/interview/verify-delete-otp`,
    REQUEST_DELETE_OTP: `${API_BASE_URL}/interview/request-delete-otp`,
  },
  CODE: {
    COMPILE: `${API_BASE_URL}/compile`
  },
  CHATBOT: {
    ASK: `${API_BASE_URL}/chatbot/ask`
  },
  SUPPORT: {
    CONTACT: `${API_BASE_URL}/support/contact`,
    STATS: `${API_BASE_URL}/support/stats`
  },
  MCQ: {
    GENERATE: `${API_BASE_URL}/mcq/generate`,
    SUBMIT: `${API_BASE_URL}/mcq/submit`,
    TOPICS: `${API_BASE_URL}/mcq/topics`
  }
};
