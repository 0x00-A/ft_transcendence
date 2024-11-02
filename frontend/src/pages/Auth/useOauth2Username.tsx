import React from 'react'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

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

const submitUsername = async (data: UsernameFormData) => {
  // try {
    const response = await axios.post(
      'http://localhost:8000/api/oauth2/set_username/',
      data,
      { withCredentials: true }
    );
    return response.data
}


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
    mutationFn: submitUsername,
    onError: (error: AxiosError) => {
      console.log(error);

      // if (error.response) {
      //     console.error('Error message:', error.response.data);
      //   } else {
      //     console.error('Unexpected error:', error.message);
      //   }
    }
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
