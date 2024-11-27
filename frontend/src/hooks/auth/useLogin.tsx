// REACT
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// API
import apiClient from "../../api/apiClient";
import { API_LOGIN_URL } from '@/api/apiConfig';

interface LoginData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(15, 'username must not exceed 15 characters!'),
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('password is required!'),
});

// const loginUser = async (user: LoginData) => {
//   return apiClient.post(API_LOGIN_URL, user);
// };

const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    reset
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange'
  });
  const mutation = useMutation({
    mutationFn: async (data: LoginData) =>  {return await apiClient.post(API_LOGIN_URL, data)},
    onError(error) {
      const errs = error?.response.data as LoginData;
      errs?.username && setError("username", {type: '', message: errs?.username}, {shouldFocus:true})
      errs?.password && setError("password", {type: '', message: errs?.password}, {shouldFocus:true})
      error?.response.data?.message && setError("root", {type: '', message: error.response.data.error});
    },
    // onSuccess(data) {
    //   if (data.data.status && data.data.status === '2FA_REQUIRED') {
    //     <Navigate to={''}/>
    //   }
    // }
  });

  return {
    register,
    handleSubmit,
    errors,
    setError,
    reset,
    mutation,
  };
}

export default useLogin
