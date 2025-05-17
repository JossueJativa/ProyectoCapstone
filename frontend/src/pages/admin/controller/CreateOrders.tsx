import { Grid, Box, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { getOrders, getOrderDishByOrderId } from '@/controller';
import { useSocket } from '@/helpers';

export const CreateOrders = () => {
    const theme = useTheme();
    const { socket } = useSocket();
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [cachedOrders, setCachedOrders] = useState<any>([]);
    const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const storedOrders = localStorage.getItem('cachedOrders');
        const storedDate = localStorage.getItem('currentDate');
        const today = new Date().toISOString().split('T')[0];

        if (storedOrders && storedDate === today) {
            try {
                const parsedOrders = JSON.parse(storedOrders);
                if (Array.isArray(parsedOrders)) {
                    setCachedOrders(parsedOrders);
                    setCurrentDate(storedDate);
                } else {
                    console.error('Invalid cachedOrders format');
                    localStorage.removeItem('cachedOrders');
                    localStorage.removeItem('currentDate');
                }
            } catch (error) {
                console.error('Error parsing cachedOrders:', error);
                localStorage.removeItem('cachedOrders');
                localStorage.removeItem('currentDate');
            }
        } else {
            // New day or no valid cache: clear everything
            localStorage.removeItem('cachedOrders');
            localStorage.setItem('currentDate', today);
            setCachedOrders([]);
            setCurrentDate(today);
        }
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('join:kitchen');

            const handleOrderReceived = (data: any) => {
                const now = new Date();
                const orderDate = now.toISOString().split('T')[0];
                const orderTime = now.toLocaleTimeString();

                setCachedOrders((prevOrders: string | any[]) => {
                    const updatedOrders = [
                        ...prevOrders,
                        {
                            id: prevOrders.length + 1,
                            desk: data.desk_id,
                            date: orderDate,
                            time: orderTime,
                            status: 'Incomplete', // Mark as incomplete by default
                            dishes: data.orderDetails.map((order: any) => ({
                                dish_name: order.details.dish_name,
                                description: order.details.description,
                                price: order.details.price,
                                quantity: order.quantity,
                                link_ar: order.details.link_ar,
                                garrisonDetails: order.garrisonDetails || [],
                            })),
                        },
                    ];
                    localStorage.setItem('cachedOrders', JSON.stringify(updatedOrders));
                    return updatedOrders;
                });
            };

            socket.on('kitchen:orderReceived', handleOrderReceived);

            return () => {
                socket.off('kitchen:orderReceived', handleOrderReceived);
            };
        }
    }, [socket, currentDate]);

    const updateOrderStatus = (updatedOrder: any) => {
        setCachedOrders((prevOrders: any) => {
            const updatedOrders = prevOrders.map((order: any) =>
                order.id === updatedOrder.id ? updatedOrder : order
            );
            localStorage.setItem('cachedOrders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await getOrders(selectedMonth);
            const orderDishPromises = response.map(async (order: any) => {
                const orderDishes = await getOrderDishByOrderId(order.id);
                return { ...order, dishes: orderDishes };
            });

            const orderDishResults = await Promise.all(orderDishPromises);
            setCachedOrders(orderDishResults);
        };
        fetchOrders();
    }, [selectedMonth]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: theme.background.primary, minHeight: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar onMonthChange={setSelectedMonth} />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px', display: 'flex' }}>
                    {/* Parte izquierda: Mostrar detalles del pedido seleccionado */}
                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {selectedOrder ? (
                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <p><strong>Fecha:</strong> {selectedOrder.date}</p>
                                <p><strong>Hora:</strong> {selectedOrder.time}</p>
                                <p><strong>Estado:</strong> {selectedOrder.status}</p>
                                <h4>Platos:</h4>
                                <ul>
                                    {selectedOrder.dishes.map((dish: any, dishIndex: number) => (
                                        <li key={dishIndex} style={{ listStyleType: 'none', marginBottom: '5px' }}>
                                            <p><strong>Nombre:</strong> {dish.dish_name} <strong>Cantidad:</strong> {dish.quantity}</p>
                                            {dish.garrisonDetails && dish.garrisonDetails.length > 0 && (
                                                <p><strong>Guarniciones:</strong> {dish.garrisonDetails.join(', ')}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <button
                                        style={{
                                            backgroundColor: selectedOrder.status === 'Complete' ? 'green' : 'red',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            const updatedOrder = {
                                                ...selectedOrder,
                                                status: selectedOrder.status === 'Complete' ? 'Incomplete' : 'Complete',
                                            };
                                            setSelectedOrder(updatedOrder);
                                            updateOrderStatus(updatedOrder);
                                        }}
                                    >
                                        {selectedOrder.status === 'Complete' ? 'Mark as Incomplete' : 'Mark as Complete'}
                                    </button>
                                </Box>
                            </Box>
                        ) : (
                            <p>Seleccione una orden para ver los detalles.</p>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {cachedOrders && cachedOrders.length > 0 ? (
                            [...cachedOrders].reverse().map((order, index) => ( // Reverse the order to show the latest first
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        backgroundColor: order.status === 'Complete' ? 'green' : '#f9f9f9', // Green if complete
                                        color: order.status === 'Complete' ? 'white' : 'black', // White text if complete
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <p><strong>Orden:</strong> #{order.id}</p>
                                    <p><strong>Mesa:</strong> {order.desk}</p>
                                    <p><strong>Fecha:</strong> {order.date}</p>
                                    <p><strong>Estado:</strong> {order.status}</p>
                                </Box>
                            ))
                        ) : (
                            <p>No hay órdenes disponibles.</p>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
