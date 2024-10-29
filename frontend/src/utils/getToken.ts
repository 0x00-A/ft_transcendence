import { jwtDecode } from "jwt-decode";
import { getApiUrl } from "./getApiUrl";

// Utility to get the expiration time from a JWT
const getTokenExpiration = (token: string) => {
    if (!token) return null;
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) return null;
    return decoded.exp * 1000;  // JWT exp is in seconds, convert to milliseconds
};

// Check if the token is expired
const isTokenExpired = (token: string) => {
    const expirationTime = getTokenExpiration(token);
    if (!expirationTime) return true;
    return expirationTime < Date.now();  // Token is expired if current time is greater than expiration time
};

// Function to refresh the token using the refresh token
const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (!storedRefreshToken) {
        throw new Error('No refresh token available');
    }

    const url = getApiUrl('auth/login/refresh/');
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: storedRefreshToken }),  // Send refresh token to refresh API
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const newAccessToken = data.access;

    // Store the new token in localStorage
    localStorage.setItem('access_token', newAccessToken);

    return newAccessToken;
};

// Helper function to get a valid token (refresh if expired)
const getToken = async () => {
    const token = localStorage.getItem('access_token');

    // Check if the token is expired
    if (!token || isTokenExpired(token)) {
        try {
            const newToken = await refreshToken();
            return newToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }

    return token;  // Return the valid token
};

// Example usage of the helper function
const useToken = async () => {
    const token = await getToken();
    console.log('Current token:', token);

    if (!token) {
        console.log('No valid token available');
    } else {
        console.log('Token is valid:', token);
    }
};

export { getToken, refreshToken, isTokenExpired };
