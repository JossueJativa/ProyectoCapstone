import { Route, Routes, useLocation } from 'react-router-dom';
import { Fab, useTheme, Box } from '@mui/material';
import { Help } from '@mui/icons-material';
import { Navbar } from '@/components';
import { Error404 } from '../errors';
import { SelectDesk, Menu, DishSelected, ShoppingCart, Invoicing } from './index';
import { CartProvider } from "@/context/CartContext";

export const ClientRouter = () => {
    const location = useLocation();
    const isSelectDesk = location.pathname === '/';
    const isErrorPage = location.pathname === '/404'; // Verifica si es la página de error
    const theme = useTheme();

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

                    {/* Navegaciones no permitidas */}
                    <Route path="*" element={<Error404 />} />
                </Routes>

                {/* Renderiza los botones flotantes solo si no es SelectDesk ni Error404 */}
                {!isSelectDesk && !isErrorPage && (
                    <>
                        <Fab
                            aria-label="help"
                            style={{
                                position: 'fixed',
                                bottom: 16,
                                right: 16,
                                backgroundColor: theme.button.mostaza, // Color del botón
                                color: theme.menu.black, // Color del ícono
                                zIndex: 30
                            }}
                            onClick={() => { console.log("Help clicked") }}
                        >
                            <Help style={{ fontSize: 30 }} />
                        </Fab>
                    </>
                )}
            </Box>
        </CartProvider>
    );
};
