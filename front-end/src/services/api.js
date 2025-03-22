// src/services/api.js

const API_URL = process.env.REACT_APP_API_BACKEND;

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'An error occurred during upload.');
  }

  return response.json();
};

export const askQuestion = async (question, context) => {
  const response = await fetch(`${API_URL}/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, context }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'An error occurred while processing your question.');
  }

  return response.json();
};