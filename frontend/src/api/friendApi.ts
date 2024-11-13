import axios from 'axios';
import apiClient from './apiClient';

const API_BASE_URL = 'http://localhost:8000/api';

export const  apiSendFriendRequest = async (username: string) => {
    try {
    const response = await apiClient.post(`/friend-request/send/${username}/`, null, {
    });
    return response.data.message || 'Friend request sent';
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Failed to send friend request');
        }
    }
};

export const apiRejectFriendRequest = async (username: string) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/friend-request/reject/${username}/`,
        null,
        {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        }
        );
        return response.data.message || 'Friend request rejected';
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Error rejecting friend request');
        }
    }
};

export const apiAcceptFriendRequest = async (username: string) => {
    try {
        const response = await apiClient.post(
            `/friend-request/accept/${username}/`,
            null,
        );
        return response.data.message || 'Friend request accepted';
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Failed to accept friend request');
            }
        }
    };

export const apiCancelFriendRequest = async (username: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/friend-request/cancel/${username}/`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        });
        return response.data.message || 'Friend request cancel';
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Failed to cancel friend request');
            }
        }
    };