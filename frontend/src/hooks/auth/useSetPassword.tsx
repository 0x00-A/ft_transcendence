import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { API_SET_PASSWORD } from '@/api/apiConfig';
import axios from 'axios';
import { SetPasswordForm } from '@/types/apiTypes';


const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('password is required!'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

const useSetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<SetPasswordForm>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: async (data: SetPasswordForm) => await apiClient.post(API_SET_PASSWORD, data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
          const errs = error?.response?.data;
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
    setError,
    clearErrors,
  };
}

export default useSetPassword
