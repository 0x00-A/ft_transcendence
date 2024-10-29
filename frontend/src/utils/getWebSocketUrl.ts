const getWebSocketUrl = (endpoint: string) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';  // Use wss for https, ws for http
    const host = window.location.hostname;  // Get the current host (e.g., localhost:3000 or yourdomain.com)
    return `${protocol}//${host}:8000/ws/${endpoint}`;  // Construct the full WebSocket URL
};

export default getWebSocketUrl;