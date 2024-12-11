import * as yup from 'yup';


export const SignupSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(20, 'username must not exceed 20 characters!'),
  email: yup
    .string()
    .email('Invalid email format!')
    .required('Email is required!'),
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(50, 'password must not exceed 20 characters!')
    .required('password is required!'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'invalid username!')
    .max(20, 'invalid username!'),
  password: yup
    .string()
    .required('password is required!')
    .min(8, 'invalid password!')
    .max(50, 'invalid password!'),
});

export const resetPasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(50, 'password must not exceed 20 characters!')
    .required('new password is required!'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

export const setUsernameSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(20, 'username must not exceed 20 characters!'),
});
