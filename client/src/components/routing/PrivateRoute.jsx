import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;