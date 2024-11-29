// React
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// API
import apiClient from '@/api/apiClient';
import {API_REGISTER_URL} from '@/api/apiConfig';
import axios from 'axios';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(15, 'username must not exceed 15 characters!'),
  email: yup
    .string()
    .email('Invalid email format!')
    .required('Email is required!'),
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('password is required!'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

// const signupApi = async (data: SignupFormData) : Promise<ApiResponse<SignupFormData> | undefined> => {
//   try {
//     const response = await apiClient.post<ApiResponse<SignupFormData>>(
//       API_REGISTER_URL,
//       data
//     );
//     return response.data
//   } catch (error) {
//   }
// }

const useSignup = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: async (data: SignupFormData) => await apiClient.post(API_REGISTER_URL, data),
    onError: (error) => {
      console.log('Signup error ==> ', error);
      if (axios.isAxiosError(error)) {
          const errs = error?.response?.data;
          errs?.username && setError("username", {type: '', message: errs?.username}, {shouldFocus:true})
          errs?.email && setError("email", {type: '', message: errs?.email}, {shouldFocus:true})
          errs?.password && setError("password", {type: '', message: errs?.password}, {shouldFocus:true})
          errs?.error && setError("root", {type: '', message: errs?.error});
        } else {
          setError("root", {type: '', message: 'Something went wrong!'});
        }
    }
  });
  return {
    register,
    handleSubmit,
    errors,
    mutation,
    reset,
    watch,
    setError,
    clearErrors,
  };
};

export default useSignup
