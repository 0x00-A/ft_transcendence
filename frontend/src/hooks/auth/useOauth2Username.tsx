import React from 'react'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

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
    const response = await apiClient.post(
      '/oauth2/set_username/',
      data,
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
      const errs = error?.response.data as UsernameFormData;
      errs?.username && setError("username", {type: '', message: errs?.username}, {shouldFocus:true})
      error?.response.data?.message && setError("root", {type: '', message: error.response.data.message});
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
