export const getApiUrl = (endpoint: string) => {
    const baseUrl = window.location.origin;  // Get the base URL (e.g., https://yourdomain.com or http://localhost:3000)
    return `${baseUrl}/api/${endpoint}`;  // Append the endpoint to the base URL
};