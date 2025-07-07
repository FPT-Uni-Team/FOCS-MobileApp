import React from 'react';
import { useAppDispatch } from '../../hooks/redux';
import useAuth from '../../hooks/useAuth';
import { loginRequest } from '../../store/slices/auth/authSlice';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import { LoginFormData } from '../../utils/validationSchemas';

interface LoginScreenProps {
  onBackPress: () => void;
  onRegisterPress: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onBackPress,
  onRegisterPress,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();

  const handleSubmit = (data: LoginFormData) => {
    dispatch(loginRequest(data));
  };

  return (
    <LoginForm
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onBackPress={onBackPress}
      onRegisterPress={onRegisterPress}
    />
  );
};

export default LoginScreen;
