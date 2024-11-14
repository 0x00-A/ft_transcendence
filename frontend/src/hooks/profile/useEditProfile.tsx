import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import apiClient from '@/api/apiClient';


interface EditProfileFormData {
    username: string;
    avatar: File;
    first_name: string;
    last_name: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    // .min(4, 'username must be at least 4 characters!')
    // .max(15, 'username must not exceed 15 characters!'),
});

const EditProfileApi = async (data) => {
  // try {
    const response = await apiClient.put(
        '/profile/edit/',
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

const useEditProfile = () => {
  // return useMutation<SignupFormData, Error, SignupFormData>(signupApi);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // watch,
    // setError,
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(schema),
    reValidateMode:'onChange',
    mode: 'onChange',
  });
  const mutation = useMutation({
    mutationFn: EditProfileApi,
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
    // watch,
    // setError,
  };
};

export default useEditProfile
