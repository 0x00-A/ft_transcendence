// React
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// API
import apiClient from '@/api/apiClient';
import { API_EDIT_PROFILE_URL } from '@/api/apiConfig';
import { AxiosError } from 'axios';


interface EditProfileFormData {
    username: string;
    avatar: FileList;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .max(30, 'Username must not exceed 15 characters!'),
  first_name: yup
    .string()
    .max(30, 'First name must not exceed 15 characters!'),
  last_name: yup
    .string()
    .max(30, 'Last name must not exceed 15 characters!'),
  email: yup
    .string()
    .email('Invalid email format!'),
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .required('password is required!'),
  // avatar: yup
  //   .mixed()
  //   .test('fileSize', 'The fil ise too large!', (value) => {
  //     if (!value) return true;
  //     return value[0].size <= 2000000;
  //   })
  //   .test('fileType', 'The file is not supported!', (value) => {
  //     if (!value) return true;
  //     return (
  //       value[0].type === 'image/png' ||
  //       value[0].type === 'image/jpg' ||
  //       value[0].type === 'image/jpeg'
  //     );
  //   }),
});

const EditProfileApi = async (data) => {
  // try {
    const response = await apiClient.put(
        API_EDIT_PROFILE_URL,
        data,
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

const useEditInfosProfile = () => {
  // return useMutation<SignupFormData, Error, SignupFormData>(signupApi);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setError,
    setValue,
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: EditProfileApi,
    onSuccess: (data) => {
      console.log('apiClient ==> EditProfile response: ', data);
    },
    onError: (error: AxiosError) => {
      const errs = error?.response.data as EditProfileFormData;
      errs?.username && setError("username", {type: '', message: errs?.username}, {shouldFocus:true})
      errs?.password && setError("password", {type: '', message: errs?.password}, {shouldFocus:true})
      errs?.first_name && setError("first_name", {type: '', message: errs?.first_name}, {shouldFocus:true})
      errs?.last_name && setError("last_name", {type: '', message: errs?.last_name}, {shouldFocus:true})
      errs?.email && setError("email", {type: '', message: errs?.email}, {shouldFocus:true})
      error?.response.data?.error && setError("root", {type: '', message: error.response.data.error});
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
