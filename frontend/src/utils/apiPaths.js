// src/utils/apiPaths.js
export const API_BASE_URL = 'http://localhost:5000/api';

export const API = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  INTERVIEW: {
    GET_ALL: `${API_BASE_URL}/interview`,
    CREATE: `${API_BASE_URL}/interview`,
    GET_ONE: (sessionId) => `${API_BASE_URL}/interview/${sessionId}`,
    DELETE: (sessionId) => `${API_BASE_URL}/interview/${sessionId}`,
    ASK_AI: `${API_BASE_URL}/interview/ask`, // ✅ ADD THIS
    GENERATE_MORE: (sessionId) => `${API_BASE_URL}/interview/generate-more/${sessionId}` // ✅ IF you're adding more Qs
  },
};
