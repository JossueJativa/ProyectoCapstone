import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element }) => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (!access && !refresh) {
        return <Navigate to="/admin" replace />;
    }
    return element;
}