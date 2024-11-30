// import { SERVER_PORT } from "../config/constants";

const getWebSocketUrl = (endpoint: string) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    // return `${protocol}//${host}:${SERVER_PORT}/ws/${endpoint}`;
    return `${protocol}//${host}/ws/${endpoint}`;
};

export default getWebSocketUrl;