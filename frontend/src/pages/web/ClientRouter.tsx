import { Route, Routes } from 'react-router-dom';

import { SocketProvider, LanguageProvider } from '@/helpers';
import { SelectDesk } from './SelectDesk';
import { Navbar } from '@/components';

export const ClientRouter = () => {
    return (
        <LanguageProvider>
            <SocketProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<SelectDesk />} />
                </Routes>
            </SocketProvider>
        </LanguageProvider>
    )
}
