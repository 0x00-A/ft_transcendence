// React
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// API
import apiClient from '@/api/apiClient';
import { API_CHANGE_PASSWORD_URL } from '@/api/apiConfig';
import { AxiosError } from 'axios';


interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const schema = yup.object().shape({
  current_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('current password is required!'),
  new_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('new password is required!'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

const changePassApi = async (data: ChangePasswordForm) => {
  // try {
    const response = await apiClient.put(
        API_CHANGE_PASSWORD_URL,
        data,
    );
    return response.data
}

const useChangePass = () => {
  // return useMutation<SignupFormData, Error, SignupFormData>(signupApi);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    setValue,
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: changePassApi,
    onSuccess: (data) => {
      console.log('apiClient ==> ChangePassword response: ', data);
    },
    onError: (error: AxiosError) => {
      const errs = error?.response.data as ChangePasswordForm;
      errs?.current_password && setError("current_pass", {type: '', message: errs?.current_password}, {shouldFocus:true})
      errs?.new_password && setError("new_password", {type: '', message: errs?.new_password}, {shouldFocus:true})
      errs?.confirm_password && setError("confirm_password", {type: '', message: errs?.confirm_password}, {shouldFocus:true})
      error?.response.data?.error && setError("root", {type: '', message: error.response.data.error});
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

export default useChangePass
