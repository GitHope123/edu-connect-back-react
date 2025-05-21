import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Cambia esto a exportación por defecto
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; // Asegúrate de usar export default