import { Route, Routes } from 'react-router-dom';
import { Login } from './auth';
import { 
    Home, Dashboard, 
    CreateDesk, CreateAlergen,
    CreateCategories, CreateGarrisons,
    CreateIngredient, CreateInvoices,
    CreateOrders
} from './controller';
import { ProtectedRoute } from './ProtectedRouter';

export const AdminRouter = () => {
    return (
        <Routes>
            <Route path="" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/desk" element={<ProtectedRoute element={<CreateDesk />} />} />
            <Route path="/allergen" element={<ProtectedRoute element={<CreateAlergen />} />} />
            <Route path="/categories" element={<ProtectedRoute element={<CreateCategories />} />} />
            <Route path="/garrisons" element={<ProtectedRoute element={<CreateGarrisons />} />} />
            <Route path="/ingredient" element={<ProtectedRoute element={<CreateIngredient />} />} />
            <Route path="/invoices" element={<ProtectedRoute element={<CreateInvoices />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<CreateOrders />} />} />
        </Routes>
    )
}
