import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Box } from '@mui/material';

// Extend the Window interface to include 'voiceflow'
declare global {
    interface Window {
        voiceflow?: any;
    }
}
import { Navbar } from '@/components';
import { Error404 } from '../errors';
import { 
    SelectDesk, Menu, DishSelected, ShoppingCart, Invoicing,
    DivideInvoice, InvoiceByMount, InvoiceByDish
} from './index';
import { CartProvider } from "@/context/CartContext";
import { useLanguage } from '@/helpers';

declare global {
    interface Window {
        voiceflow?: any;
    }
}

export const ClientRouter = () => {
    const location = useLocation();
    const { language } = useLanguage();
    const isSelectDesk = location.pathname === '/';
    const isErrorPage = location.pathname === '/404';

    useEffect(() => {
        if (!isSelectDesk && !isErrorPage) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
            script.onload = () => {
                if (language === 'en') {
                    window.voiceflow?.chat?.load({
                        verify: { projectID: '682beb072932dfdc88e975a5' },
                        url: 'https://general-runtime.voiceflow.com',
                        versionID: 'production',
                        voice: {
                            url: 'https://runtime-api.voiceflow.com',
                        },
                    });
                } else {
                    window.voiceflow?.chat?.load({
                        verify: { projectID: '682be9f89b2c86fa4db2994d' },
                        url: 'https://general-runtime.voiceflow.com',
                        versionID: 'production',
                        voice: {
                            url: 'https://runtime-api.voiceflow.com',
                        },
                    });
                }
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script); // Limpia el script al desmontar
            };
        }
    }, [isSelectDesk, isErrorPage, language]);

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