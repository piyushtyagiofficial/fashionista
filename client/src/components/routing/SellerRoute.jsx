import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext.jsx';
import Loader from '../common/Loader.jsx';

const SellerRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default SellerRoute;