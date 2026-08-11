import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
  onUnauthenticated: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onUnauthenticated,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7FAF9]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#006A6A] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-sm text-[#44474F]">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    onUnauthenticated();
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7FAF9] p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FCE8E6] text-[#B3261E] flex items-center justify-center mb-4">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 className="font-headline font-bold text-2xl text-[#000A1F] mb-2">Access Restricted</h2>
        <p className="font-sans text-sm text-[#44474F] max-w-md mb-6">
          Your account role ({user.role}) does not have permission to view this section.
        </p>
        <button
          onClick={onUnauthenticated}
          className="px-6 py-2.5 bg-[#000A1F] text-white font-mono text-xs font-medium rounded-lg hover:bg-[#00204A] transition-colors cursor-pointer"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
