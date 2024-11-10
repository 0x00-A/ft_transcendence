import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from "axios";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { error } from 'console';
import { getApiUrl } from '../../utils/getApiUrl';

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

const signupApi = async (data: SignupFormData) => {
  // try {
    const response = await axios.post(
      // 'http://localhost:8000/api/auth/signup/',
      getApiUrl('auth/signup/'),
      data
    );
    return response.data
  // }
  // catch (error) {
  //   // if (axios.isAxiosError(error)) {
  //   //   if (error.response) {
  //   //     console.error('Server responded with an error:', error.response.data);
  //   //     console.error('Status code:', error.response.status);
  //   //   } else if (error.request) {
  //   //     console.error('No response from server:', error.request);
  //   //   } else {
  //   //     console.error('Error setting up request:', error.message);
  //   //   }
  //   // } else {
  //   //   console.error('Unexpected error:', error);
  //   // }
  // }
}

const useSignup = () => {
  // return useMutation<SignupFormData, Error, SignupFormData>(signupApi);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
    //  delayError: 1000,
  });
  const mutation = useMutation({
    mutationFn: signupApi,
    onError: (error: AxiosError) => {
      if (error.response) {
          console.error('Error message:', error.response.data);
        } else {
          console.error('Unexpected error:', error.message);
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
  };
};

export default useSignup
