import apiClient from './apiClient';

export const apiCreateConversation = async (user2Id: string) => {
    try {
        const response = await apiClient.post(`/chat/conversations/create/`, { user2_id: user2Id });
        return response.data || 'Conversation created successfully';
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Failed to create conversation');
        }
    }
};

export const apiDeleteConversation = async (conversationId: Number) => {
    try {
        const response = await apiClient.delete(`/chat/conversations/${conversationId}/delete/`);
        return response.data || 'Conversation deleted successfully';
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Failed to delete conversation');
        }
    }
};