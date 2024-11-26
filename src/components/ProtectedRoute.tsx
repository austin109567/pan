import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ConnectPrompt } from './ConnectPrompt';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAdmin?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAdmin = false 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (!user) {
    return <ConnectPrompt />;
  }

  if (requiresAdmin && user.uid !== import.meta.env.VITE_ADMIN_WALLET) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};