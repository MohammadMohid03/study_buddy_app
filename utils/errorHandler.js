// This function will be our single source of truth for parsing API errors
export const getErrorMessage = (error) => {
  // 1. Check for a specific message from our backend
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  
  // 2. Check for network errors (server is down, no internet, etc.)
  if (error.request) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // 3. For any other unexpected errors
  return 'An unexpected error occurred. Please try again later.';
};