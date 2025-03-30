import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Fab, Button, useTheme, Box } from '@mui/material';
import { Help, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { useLanguage, useSocket } from '@/helpers';
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
    const { socket } = useSocket();
    const [cartCount, setCartCount] = useState(0);
    const [cartDetails, setCartDetails] = useState<any[]>([]); // State to store cart details

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get('desk_id');

        if (socket && desk_id) {
            // Fetch initial cart details
            socket.emit('order:get', { desk_id }, (error: any, orderDetails: any[]) => {
                if (error) {
                    console.error('Error fetching cart details:', error);
                    return;
                }
                setCartCount(orderDetails.length);
                setCartDetails(orderDetails); // Store cart details
                console.log('Initial cart details:', orderDetails); // Log cart details
            });

            // Listen for updates to the cart
            const handleOrderCreated = () => {
                socket.emit('order:get', { desk_id }, (error: any, orderDetails: any[]) => {
                    if (error) {
                        console.error('Error fetching updated cart details:', error);
                        return;
                    }
                    setCartCount(orderDetails.length);
                    setCartDetails(orderDetails); // Update cart details
                    console.log('Updated cart details:', orderDetails); // Log updated cart details
                });
            };

            socket.on('order:created', handleOrderCreated);
            socket.on('order:deleted', handleOrderCreated);
            socket.on('order:deleted:all', () => {
                setCartCount(0);
                setCartDetails([]); // Clear cart details
                console.log('Cart cleared');
            });

            return () => {
                socket.off('order:created', handleOrderCreated);
                socket.off('order:deleted', handleOrderCreated);
                socket.off('order:deleted:all');
            };
        }
    }, [socket, location.search]);

    return (
        <Box mb={'25px'}>
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
                        {texts.buttons.cart} ({cartCount})
                    </Button>
                </>
            )}
        </Box>
    );
};
