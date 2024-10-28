import { useEffect, useRef, useState } from 'react';
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
    try {
        const storedRefreshToken = localStorage.getItem('refresh_token');  // Get refresh token from storage

        // Send request to the refresh token endpoint
        const response = await fetch('http://localhost:8000/api/auth/login/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: storedRefreshToken,  // Include the refresh token
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const newAccessToken: string = data.access;  // Get the new access token
            localStorage.setItem('access_token', newAccessToken);  // Store the new access token
            return newAccessToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Handle error (e.g., log out user or show an error message)
    }
};


const useWebSocket = (endpoint: string) => {
    const socket = useRef<WebSocket | null>(null);  // Store WebSocket instance
    // let token = localStorage.getItem('access_token');  // Get the token from localStorage
    const [token, setToken] = useState<string>(localStorage.getItem('access_token') || '');

    const baseUrl = 'ws://localhost:8000/ws/';  // Base URL for WebSocket

    const decodeJwt = (token: string) => {
        const decoded = jwtDecode(token);  // Decodes the JWT
        return decoded;
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            // (async () => {
            //     const currentTime = Date.now() / 1000;  // Get current time in seconds
            //     const tokenExpiration = decodeJwt(token).exp;  // Decode the token to get expiration (example function)

            //     if (tokenExpiration && tokenExpiration < currentTime) {
            //         const newToken = await refreshToken();  // Call your refreshToken function here
            //         setToken(newToken);
            //     }
            // })();
            // Create the WebSocket connection
            socket.current = new WebSocket(`${baseUrl}${endpoint}?token=${token}`);

            // Clean up on component unmount
            // return () => {
            //     if (socket.current) {
            //         socket.current.close();
            //     }
            // };
        }, 500);
        return () => clearTimeout(timeout);
    }, [endpoint, token]);

    return socket.current;  // Return the WebSocket instance
};

export default useWebSocket;
