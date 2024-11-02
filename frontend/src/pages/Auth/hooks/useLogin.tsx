import axios from "axios";
import { useMutation } from '@tanstack/react-query';
import { useAuth } from "../../../contexts/AuthContext";
import { getApiUrl } from "../../../utils/getApiUrl";

interface LoginData {
  username: string;
  password: string;
}

const loginUser = async (user: LoginData) => {
  const response = await axios.post(
    // 'http://localhost:8000/api/auth/login/',
    getApiUrl('auth/login/'),
    user
  );
  return response.data;
};

const useLogin = () => {
    const { setIsLoggedIn } = useAuth();
    return useMutation({
    mutationFn: loginUser,
    onSuccess(data, va, con) {
      console.log(data);
      console.log('---------------------');
      console.log(va);
      console.log('---------------------');
      console.log(con);
      console.log('---------------------');
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setIsLoggedIn(true);
    },
    onError(error) {
      // setAuthResponse({isRequesting: true, isSuccess: true, data: data, error: null});
      console.log(error);
      // setSignupState(true);
    },
  });

}

export default useLogin
