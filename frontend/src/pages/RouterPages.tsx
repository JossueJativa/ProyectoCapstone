import { Routes, Route } from 'react-router-dom';

import { ClientRouter } from './web';
import { AdminRouter } from './admin';
import { GlobalTheme } from '@/assets';

export const Router = () => {
    return (
        <GlobalTheme>
            <Routes>
                <Route path="/admin/*" element={<AdminRouter />} />
                <Route path="/*" element={<ClientRouter />} />
            </Routes>
        </GlobalTheme>
    )
}
