import { getApiUrl } from "@/utils/getApiUrl";

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

export const API_BASE_URL = `${getApiUrl('')}`;

////////////////////
// AUTHENTICATION //
////////////////////
export const API_SIGNUP_URL = "/auth/signup/";
export const API_EMAIL_VERIFICATION_URL = "/auth/email-verification/";
export const API_LOGIN_URL = "/auth/login/";
export const API_LOGIN_OTP_URL = "auth/login/otp-verification/";
export const API_RESET_PASSWORD_REQUEST_URL = "/auth/reset-password-request/";
export const API_RESET_PASSWORD_URL = "/auth/reset-password/";
// OAUTH2
// export const API_OAUTH2_URL = getApiUrl('/auth/oauth2');
export const API_OAUTH2_URL = getApiUrl('/auth/oauth2');
export const API_OAUTH2_SETUSERNAME_URL = "/auth/oauth2/set-username/";

export const API_LOGOUT_URL = "/auth/logout/";

export const API_GET_PROFILE_URL = "/profile/";
export const API_EDIT_PROFILE_URL = "/edit/profile/";
export const API_UPDATE_EMAIL_REQUEST_URL = "/edit/update-email-request/"
export const API_UPDATE_EMAIL_URL = "/edit/update-email/";
export const API_UPDATE_PASSWORD_URL = "/security/update-password/";

export const API_ENABLE_2FA_REQUEST_URL = "/security/enable-2fa-request/";
export const API_ENABLE_2FA_URL = "/security/enable-2fa/";
export const API_DISABLE_2FA_URL = "/security/disable-2fa/";

export const API_GET_FRIENDS_URL = "/friends";

export const API_CONFIRM_LOGIN_URL = "/auth/confirm_login/";

export const REDIRECT_URL_UPDATE_EMAIL = `${window.location.protocol}//${window.location.host}${window.location.port}/edit/update-email`;

export const API_SET_PASSWORD = "/security/set_password/";

export const API_GET_ACHIEVEMENTS_URL = "/achievements";

export const API_GET_PLAYED_GAMES_URL = "/matchmaker/played_games";
