import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/admin" replace />;
    }
    return element;
}