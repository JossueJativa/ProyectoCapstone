import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Fab, Button, useTheme, Box } from '@mui/material';
import { Help, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

import { SocketProvider, useLanguage } from '@/helpers';
import { Navbar } from '@/components';

import { Error404 } from '../errors';
import {
    SelectDesk, Menu, DishSelected,
    ShoppingCart
} from './index';


export const ClientRouter = () => {
    const location = useLocation();
    const isSelectDesk = location.pathname === '/';
    const isErrorPage = location.pathname === '/404'; // Verifica si es la página de error
    const theme = useTheme();
    const { texts } = useLanguage();
    const navigate = useNavigate();

    return (
        <Box mb={'25px'}>
            <SocketProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<SelectDesk />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/dish/:dishId" element={<DishSelected />} />
                    <Route path="/cart" element={<ShoppingCart />} />
                    
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

                        <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<ShoppingCartIcon />}
                            onClick={() => { 
                                navigate(`/cart?desk_id=${new URLSearchParams(location.search).get('desk_id')}`);
                            }}
                            style={{
                                height: '50px',
                                width: '200px',
                                borderRadius: theme.button.border.corners,
                                position: 'fixed',
                                bottom: 16,
                                left: '47%',
                                transform: 'translateX(-50%)',
                                backgroundColor: theme.button.beige,
                                color: theme.menu.black,
                                zIndex: 30,
                            }}
                        >
                            {texts.buttons.cart}
                        </Button>
                    </>
                )}
            </SocketProvider>
        </Box>
    );
};
