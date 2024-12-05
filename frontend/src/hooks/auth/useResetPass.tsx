// React
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// API
import apiClient from '@/api/apiClient';
import { API_RESET_PASSWORD_URL } from '@/api/apiConfig';
import axios from 'axios';
import { ResetPasswordForm } from '@/types/apiTypes';


const schema = yup.object().shape({

  new_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('new password is required!'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('password confirmation is required!'),
});


const useResetPass = () => {
  // return useMutation<SignupFormData, Error, SignupFormData>(signupApi);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    setValue,
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => await apiClient.post( API_RESET_PASSWORD_URL, data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errs = error?.response?.data;
        errs?.new_password && setError("new_password", {type: '', message: errs?.new_password}, {shouldFocus:true})
        errs?.confirm_password && setError("confirm_password", {type: '', message: errs?.confirm_password}, {shouldFocus:true})
        error?.response?.data?.error && setError("root", {type: '', message: error.response.data.error});
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
    setValue,
    watch,
    setError,
  };
};

export default useResetPass;
