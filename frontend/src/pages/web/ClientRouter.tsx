import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { Navbar } from '@/components';
import { Error404 } from '../errors';
import { 
    SelectDesk, Menu, DishSelected, ShoppingCart, Invoicing,
    DivideInvoice, InvoiceByMount, InvoiceByDish
} from './index';
import { CartProvider } from "@/context/CartContext";

declare global {
    interface Window {
        voiceflow?: any;
    }
}

export const ClientRouter = () => {
    const location = useLocation();
    const isSelectDesk = location.pathname === '/';
    const isErrorPage = location.pathname === '/404';

    useEffect(() => {
        if (!isSelectDesk && !isErrorPage) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
            script.onload = () => {
                window.voiceflow?.chat?.load({
                    verify: { projectID: '680ac6dbe61d2476b0f2db11' },
                    url: 'https://general-runtime.voiceflow.com',
                    versionID: 'production',
                    voice: {
                        url: 'https://runtime-api.voiceflow.com',
                    },
                });
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script); // Limpia el script al desmontar
            };
        }
    }, [isSelectDesk, isErrorPage]);

    return (
        <CartProvider>
            <Box mb={'25px'}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<SelectDesk />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/dish/:dishId" element={<DishSelected />} />
                    <Route path="/cart" element={<ShoppingCart />} />
                    <Route path="/invoice/:id" element={<Invoicing />} />
                    <Route path="/divide-invoice/:id" element={<DivideInvoice />} />
                    <Route path="/invoice-by-amount/:id" element={<InvoiceByMount />} />
                    <Route path="/invoice-by-dish/:id" element={<InvoiceByDish />} />
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </Box>
        </CartProvider>
    );
};