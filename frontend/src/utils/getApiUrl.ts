import { SERVER_PORT } from "../config/constants";

export const getApiUrl = (endpoint: string) => {
    // const baseUrl = window.location.origin;
    const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
    return `${baseUrl}:${SERVER_PORT}/api/${endpoint}`;
};