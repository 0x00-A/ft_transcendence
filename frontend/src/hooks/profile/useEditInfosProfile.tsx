// React
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// API
import apiClient from '@/api/apiClient';
import { API_EDIT_PROFILE_URL } from '@/api/apiConfig';
import axios from 'axios';
import { EditProfileFormData } from '@/types/apiTypes';
import { EditInfosProfileSchema } from '@/types/formSchemas';


const useEditInfosProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setError,
    setValue,
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(EditInfosProfileSchema()),
    // reValidateMode:'onChange',
    mode: 'onSubmit',
  });
  const mutation = useMutation({
    mutationFn: async (data: FormData) => await apiClient.put(API_EDIT_PROFILE_URL, data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errs = error?.response?.data;
        errs?.username && setError("username", {type: '', message: errs?.username}, {shouldFocus:true})
        errs?.first_name && setError("first_name", {type: '', message: errs?.first_name}, {shouldFocus:true})
        errs?.last_name && setError("last_name", {type: '', message: errs?.last_name}, {shouldFocus:true})
        errs?.password && setError("password", {type: '', message: errs?.password}, {shouldFocus:true})
        errs?.avatar && setError("avatar", {type: '', message: errs?.avatar}, {shouldFocus:true})
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
    isValid,
    mutation,
    reset,
    setValue,
    watch,
    setError,
  };
};

export default useEditInfosProfile
