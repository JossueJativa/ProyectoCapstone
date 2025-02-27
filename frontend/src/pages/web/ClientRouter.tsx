import { Route, Routes } from 'react-router-dom';

import { SocketProvider, LanguageProvider } from '@/helpers';
import { Navbar } from '@/components';

import { SelectDesk } from './SelectDesk';
import { Menu } from './Menu';


export const ClientRouter = () => {
    return (
        <LanguageProvider>
            <SocketProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<SelectDesk />} />
                    <Route path="/menu" element={<Menu />} />
                </Routes>
            </SocketProvider>
        </LanguageProvider>
    )
}
