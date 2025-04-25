import { Route, Routes } from 'react-router-dom';
import { Login } from './auth';
import { Home, Dashboard } from './controller';
import { ProtectedRoute } from './ProtectedRouter';

export const AdminRouter = () => {
    return (
        <Routes>
            <Route path="" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        </Routes>
    )
}
