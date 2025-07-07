import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/auth/authSlice';
import { useAppSelector } from './redux';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    loading,
    error,
    isInitialized,
    logout: handleLogout,
  };
};

export default useAuth;
