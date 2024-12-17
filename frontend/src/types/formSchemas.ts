import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

export const SignupSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    username: yup
      .string()
      .required(t('Profile.errors.signup.username.required'))
      .min(4, t('Profile.errors.signup.username.min'))
      .max(30, t('Profile.errors.signup.username.max')),
    email: yup
      .string()
      .email(t('Profile.errors.signup.email.invalid'))
      .required(t('Profile.errors.signup.email.required')),
    password: yup
      .string()
      .min(8, t('Profile.errors.signup.password.min'))
      .max(64, t('Profile.errors.signup.password.max'))
      .required(t('Profile.errors.signup.password.required')),
    password2: yup
      .string()
      .oneOf([yup.ref('password')], t('Profile.errors.signup.confirmPassword.match'))
      .required(t('Profile.errors.signup.confirmPassword.required')),
  });
};

export const ChangePasswordSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    current_password: yup
      .string()
      .min(8, t('Profile.errors.changePassword.currentPassword.min'))
      .max(64, t('Profile.errors.changePassword.currentPassword.max'))
      .required(t('Profile.errors.changePassword.currentPassword.required')),
    new_password: yup
      .string()
      .min(8, t('Profile.errors.changePassword.newPassword.min'))
      .max(64, t('Profile.errors.changePassword.newPassword.max'))
      .required(t('Profile.errors.changePassword.newPassword.required')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('new_password')], t('Profile.errors.changePassword.confirmPassword.match'))
      .required(t('Profile.errors.changePassword.confirmPassword.required')),
  });
};

export const LoginSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    username: yup
      .string()
      .required(t('Profile.errors.login.username.required'))
      .min(4, t('Profile.errors.login.username.min'))
      .max(20, t('Profile.errors.login.username.max')),
    password: yup
      .string()
      .required(t('Profile.errors.login.password.required'))
      .min(8, t('Profile.errors.login.password.min'))
      .max(64, t('Profile.errors.login.password.max')),
  });
};

export const ResetPasswordSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    new_password: yup
      .string()
      .min(8, t('Profile.errors.resetPassword.newPassword.min'))
      .max(64, t('Profile.errors.resetPassword.newPassword.max'))
      .required(t('Profile.errors.resetPassword.newPassword.required')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('new_password')], t('Profile.errors.resetPassword.confirmPassword.match'))
      .required(t('Profile.errors.resetPassword.confirmPassword.required')),
  });
};

export const SetPasswordSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    password: yup
      .string()
      .min(8, t('Profile.errors.setPassword.password.min'))
      .max(64, t('Profile.errors.setPassword.password.max'))
      .required(t('Profile.errors.setPassword.password.required')),
    password2: yup
      .string()
      .oneOf([yup.ref('password')], t('Profile.errors.setPassword.confirmPassword.match'))
      .required(t('Profile.errors.setPassword.confirmPassword.required')),
  });
};

export const SetUsernameSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    username: yup
      .string()
      .required(t('Profile.errors.setUsername.username.required'))
      .min(4, t('Profile.errors.setUsername.username.min'))
      .max(30, t('Profile.errors.setUsername.username.max')),
  });
};

export const otpSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    otp: yup
      .string()
      .required(t('Profile.errors.otp.otp.required'))
      .length(6, t('Profile.errors.otp.otp.length'))
      .matches(/^[0-9]+$/, t('Profile.errors.otp.otp.matches')),
  });
};

export const EditInfosProfileSchema = () => {
  const { t } = useTranslation();

  return yup.object().shape({
    username: yup
      .string()
      .min(4, t('Profile.errors.editProfile.username.min'))
      .max(30, t('Profile.errors.editProfile.username.max')),
    first_name: yup
      .string()
      .min(3, t('Profile.errors.editProfile.firstName.min'))
      .max(30, t('Profile.errors.editProfile.firstName.max')),
    last_name: yup
      .string()
      .min(3, t('Profile.errors.editProfile.lastName.min'))
      .max(30, t('Profile.errors.editProfile.lastName.max')),
    email: yup
      .string()
      .email(t('Profile.errors.editProfile.email.invalid')),
    password: yup
      .string()
      .min(8, t('Profile.errors.editProfile.password.min'))
      .max(64, t('Profile.errors.editProfile.password.max'))
      .required(t('Profile.errors.editProfile.password.required')),
    avatar: yup
      .mixed()
      .test('fileSize', t('Profile.errors.editProfile.avatar.fileSize'), (value) => {
        if (!value) return true;
        return value[0].size <= 2000000;
      })
      .test('fileType', t('Profile.errors.editProfile.avatar.fileType'), (value) => {
        if (!value) return true;
        return (
          value[0].type === 'image/png' ||
          value[0].type === 'image/jpg' ||
          value[0].type === 'image/jpeg'
        );
      }),
  });
};