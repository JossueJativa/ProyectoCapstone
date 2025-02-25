import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';

interface ProtectedRouteProps {
    element: ReactElement;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (!access && !refresh) {
        return <Navigate to="/admin" replace />;
    }
    return element;
}