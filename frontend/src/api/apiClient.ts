import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// import jwt_decode from 'jwt-decode';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

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

// Adding a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class APIClient {
  static async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(
      endpoint,
      config
    );
    return response.data;
  }

  static async post<T, D>(
    endpoint: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  // You can add more methods (put, delete, patch) if needed, similarly typed.
}

export default APIClient;

const useAxios = () => {
  const { authToken, setUser, setTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `bearer ${authToken?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authToken.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) return req;
    const response = await axios.post(`${baseURL}/token/refresh`, {
      refresh: authToken.refresh,
    });
    localStorage.setItem('authToken', JSON.stringify(response.data));

    setAuthTokens(response.data);
    setUser(jwt_decode(response.data.access));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });
};
