// React
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
// API
import apiClient from '@/api/apiClient';
import { API_OAUTH2_SETUSERNAME_URL } from '@/api/apiConfig';
import axios from 'axios';

interface UsernameFormData {
  username: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(15, 'username must not exceed 15 characters!'),
});

// const submitUsername = async (data: UsernameFormData) => {
//   // try {
//     const response = await apiClient.post(
//       '/oauth2/set_username/',
//       data,
//     );
//     return response.data
// }


const useOauth2Username = () => {

  const {
    register,
    handleSubmit,
    formState : {errors},
    reset,
    setError,
  } = useForm<UsernameFormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: async (data: UsernameFormData) => { return await apiClient.post(API_OAUTH2_SETUSERNAME_URL, data) },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errs = error?.response?.data;
        errs?.username && setError("username", {type: '', message: errs?.username}, {shouldFocus:true});
        errs?.error && setError("root", {type: '', message: errs.error});
      }
    },
  });
  return {
    register,
    handleSubmit,
    reset,
    errors,
    setError,
    mutation
  }
}

export default useOauth2Username
