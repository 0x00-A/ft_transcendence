import axios from "axios"
import jwt_decode from 'jwt-decode'


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

class APIClient<T> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    get = () => {
        return axiosInstance.get<T>(this.endpoint);
    }

    post = (data: T) =>  {
        return axiosInstance.post<T>(this.endpoint, data);
    }
}

export default APIClient


const useAxios = () => {
    const {authToken, setUser, setTokens} = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL,
        headers: {Authorization: `bearer ${authToken?.access}`}
    })

    axiosInstance.interceptors.request.use(async req => {
        const user = jwt_decode(authToken.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

        if (isExpired) return req
        const response = await axios.post(`${baseURL}/token/refresh`, {
            refresh: authToken.refresh
        })
        localStorage.setItem("authToken", JSON.stringify(response.data))

        setAuthTokens(response.data)
        setUser(jwt_decode(response.data.access))

        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })
}