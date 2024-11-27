
export interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    status: number;
    error: string;
    details?: string;
}

export const API_BASE_URL = "http://localhost:8000/api";

export const API_LOGIN_URL = "/auth/login/";

export const API_LOGOUT_URL = "/auth/logout/";

export const API_REGISTER_URL = "/auth/signup/";

export const API_CONFIRM_LOGIN_URL = "/auth/confirm_login/";

export const API_OAUTH2_URL = "http://localhost:8000/api/auth/oauth2";

export const API_NEW_USERNAME_URL = "/auth/new_username/";

export const API_GET_PROFILE_URL = "/profile/";

export const API_EDIT_PROFILE_URL = "/edit/informations/";

export const API_CHANGE_PASSWORD_URL = "/security/change_password/";