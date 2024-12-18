import * as yup from 'yup';


export const SignupSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(30, 'username must not exceed 30 characters!'),
  email: yup
    .string()
    .email('Invalid email format!')
    .required('Email is required!'),
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(64, 'password must not exceed 64 characters!')
    .required('password is required!'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

export const ChangePasswordSchema = yup.object().shape({
  current_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(64, 'password must not exceed 64 characters!')
    .required('current password is required!'),
  new_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(64, 'password must not exceed 64 characters!')
    .required('password is required!'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

export const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'invalid username!')
    .max(20, 'invalid username!'),
  password: yup
    .string()
    .required('password is required!')
    .min(8, 'invalid password!')
    .max(64, 'invalid password!'),
});

export const ResetPasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(64, 'password must not exceed 64 characters!')
    .required('new password is required!'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('password confirmation is required!'),
});

export const SetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(64, 'password must not exceed 64 characters!')
    .required('password is required!'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('password confirmation is required!'),
});


export const SetUsernameSchema = yup.object().shape({
  username: yup
    .string()
    .required('username is required!')
    .min(4, 'username must be at least 4 characters!')
    .max(30, 'username must not exceed 30 characters!'),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required!')
    .length(6, 'OTP must be 6 digits!')
    .matches(/^[0-9]+$/, 'OTP must be a number!'),
});

export const EditInfosProfileSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, 'Username must be at least 4 characters!')
    .max(30, 'Username must not exceed 15 characters!'),
  first_name: yup
    .string()
    .min(3, 'First name must be at least 3 characters!')
    .max(30, 'First name must not exceed 15 characters!'),
  last_name: yup
    .string()
    .min(3, 'Last name must be at least 3 characters!')
    .max(30, 'Last name must not exceed 15 characters!'),
  email: yup
    .string()
    .email('Invalid email format!'),
  password: yup
    .string()
    .min(8, 'password must be at least 8 characters!')
    .max(64, 'password must not exceed 64 characters!')
    .required('password is required!'),
  avatar: yup
    .mixed<File>()
    .test('fileSize', 'The file is too large!', (value) => {
      if (!value) return true;
      return value.size <= 2000000;
    })
    .test('fileType', 'The file is not supported!', (value) => {
      if (!value) return true;
      return (
        value.type === 'image/png' ||
        value.type === 'image/jpg' ||
        value.type === 'image/jpeg'
      );
    }),
});