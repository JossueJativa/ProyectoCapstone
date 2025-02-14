import { Routes, Route } from 'react-router-dom';

import { Login } from './auth';
import { Dashboard } from './controller';
import { ProtectedRoute } from './ProtectedRoute';
import './css/style.css';

export const AdminRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute element={<Dashboard />} />} />
        </Routes>
    )
}
