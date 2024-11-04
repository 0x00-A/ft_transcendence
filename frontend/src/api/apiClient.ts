import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { error } from 'console';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import confirmLogout from '../components/Sidebar/Sidebar'
// const getExpiryTime = (token) => {
//   const decoded = jwtDecode(token);
//   return decoded.exp * 1000;
// }


// const isTokenExpired = (token) => Date.now() > getExpiryTime(token);


const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// apiClient.interceptors.request.use(async (config) => {
//   const access_token = localStorage.getItem('access_token');
//   if (access_token && isTokenExpired(access_token)) {
//     const new_token = await refreshAccessToken();
//     localStorage.setItem('access_token', new_token);
//     config.headers['Authorization'] = `Bearer ${new_token}`;
//   }
//   return config;
// });

// here handle if a response fron api is 401_UNAUTHORIZED that means the token in note in httpOnly cookies or is expired
// so you should request api to logout (clear the cookies) and nivaigate to auth page , set user as not logged in
// const navigate = useNavigate();
// const {setIsLoggedIn} = useAuth();

// apiClient.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     if (error.response && error.response.status === 401) {
//       console.log('----interceptors-----');

//       confirmLogout()
//       // const response = await apiClient.post('http://localhost:8000/api/auth/logout/', {}, {withCredentials: true});
//       // console.log('----response from interceptors.response-error-------', response);
//       // setIsLoggedIn(false);
//       // navigate('/auth')
//     }
//     return Promise.reject(error)
//   }
// )


// const refreshAccessToken = async () => {
//   const navigate = useNavigate()
//   try {
//     const response = await axios.post('http://localhost:8000/api/auth/refresh_token/', null, {withCredentials: true})
//     const newAccessToken = response.data.access_token;
//     return newAccessToken;
//   }
//   catch (error) {
//     console.error('Refresh token failed: ', error);
//     navigate('/auth')
//   }
// }

export default apiClient;

// interface ApiResponse<T> {
//   data: T;
// }

// class APIClient<T> {
// //   get = () => {
// //     return axiosInstance.get<T>(this.endpoint);
// //   };

// //   post = (data: T) => {
// //     return axiosInstance.post<T>(this.endpoint, data);
// //   };

//   static async get<T>(endpoint: string) {
//     const response = await axiosInstance.get<T>(endpoint);
//     return response.data;
//   }

//   static async post<T>(endpoint: string, data: T) {
//     const response = await axiosInstance.post(endpoint, data);
//     return response.data;
//   }
// }

// const istokenexpired = (token) => {
//   if (!token) return true; // Token is not available

//   const decoded = jwtDecode(token);
//   const currentTime = Date.now() / 1000; // Current time in seconds

//   return decoded.exp < currentTime; // Check if the token is expired
// };

// const refreshAccessToken = async (refreshToken) => {
//   try {
//     const response = await axios.post('/api/refresh-token', {
//       token: refreshToken,
//     });
//     localStorage.setItem('access_token', response.data);
//   } catch (error) {
//     console.error('Failed to refresh token', error);
//   }
// };

// Adding a request interceptor


// class APIClient {
//   static async get<T>(
//     endpoint: string,
//     config?: AxiosRequestConfig
//   ): Promise<T> {
//     const response: AxiosResponse<T> = await axiosInstance.get(
//       endpoint,
//       config
//     );
//     return response.data;
//   }

//   static async post<T, D>(
//     endpoint: string,
//     data: D,
//     config?: AxiosRequestConfig
//   ): Promise<T> {
//     const response: AxiosResponse<T> = await axiosInstance.post(
//       endpoint,
//       data,
//       config
//     );
//     return response.data;
//   }

  // You can add more methods (put, delete, patch) if needed, similarly typed.
// }

// export default APIClient;

// const useAxios = () => {
//   const { authToken, setUser, setTokens } = useContext(AuthContext);

//   const axiosInstance = axios.create({
//     baseURL,
//     headers: { Authorization: `bearer ${authToken?.access}` },
//   });

//   axiosInstance.interceptors.request.use(async (req) => {
//     const user = jwtDecode(authToken.access);
//     const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

//     if (isExpired) return req;
//     const response = await axios.post(`${baseURL}/token/refresh`, {
//       refresh: authToken.refresh,
//     });
//     localStorage.setItem('authToken', JSON.stringify(response.data));

//     setAuthTokens(response.data);
//     setUser(jwt_decode(response.data.access));

//     req.headers.Authorization = `Bearer ${response.data.access}`;
//     return req;
//   });
// };
