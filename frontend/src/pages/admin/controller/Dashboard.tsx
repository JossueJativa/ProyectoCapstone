import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { getOrders } from '@/controller';

export const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState<keyof typeof monthMap>('Enero');
    const [orders, setOrders] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const currentYear = new Date().getFullYear();
    const theme = useTheme();

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];

    // Map months to their respective numbers
    const monthMap = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
    };

    useEffect(() => {
        // Fetch orders from the API
        const fetchOrders = async () => {
            try {
                const orders = await getOrders();
                setOrders(orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        // Filter orders by the selected month and year
        const filteredOrders = orders.filter((order) => {
            const [year, , month] = order.date.split('-').map(Number);
            return (
                month === monthMap[selectedMonth] &&
                year === currentYear
            );
        });

        // Sum all total_price values for the selected month
        const totalPrice = filteredOrders.reduce((sum, order) => sum + order.total_price, 0);

        // Count all items (order_dish) for the selected month
        const totalItems = filteredOrders.reduce((sum, order) => sum + order.order_dish.length, 0);

        setTotalPrice(totalPrice);
        setTotalItems(totalItems);
    }, [selectedMonth, orders]);

    return (
        <Grid container spacing={2} pb={2} minHeight={'100vh'} sx={{
            backgroundColor: theme.background.secondary,
            padding: '20px',
        }}>
            {/* Sidebar */}
            <Grid item xs={2}>
                <Box
                    sx={{
                        height: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {currentYear}
                    </Typography>
                    {months.map((month) => (
                        <Box
                            key={month}
                            sx={{
                                padding: '10px',
                                backgroundColor: theme.button.beige,
                                borderRadius: theme.button.border.rounded,
                                cursor: 'pointer',
                                textAlign: 'center',
                                mb: 1,
                                ...(selectedMonth === month && {
                                    border: '2px solid black',
                                }),
                            }}
                            onClick={() => setSelectedMonth(month)}
                        >
                            <Typography sx={{
                                fontWeight: selectedMonth === month ? 'bold' : 'normal',
                            }}>{month}</Typography>
                        </Box>
                    ))}
                </Box>
            </Grid>

            {/* Main Content */}
            <Grid item xs={10}>
                <Grid container spacing={2}>
                    {/* Top Cards */}
                    <Grid item xs={4}>
                        <Paper sx={{ padding: '16px', textAlign: 'center' }}>
                            <Typography variant="h6">Monto total de facturas</Typography>
                            <Typography variant="h4">${totalPrice.toFixed(2)}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper sx={{ padding: '16px', textAlign: 'center' }}>
                            <Typography variant="h6">Cantidad total de ítems vendidos</Typography>
                            <Typography variant="h4">{totalItems}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper sx={{ padding: '16px', textAlign: 'center' }}>
                            <Typography variant="h6">Total de usuarios del sistema</Typography>
                            <Typography variant="h4">300</Typography>
                        </Paper>
                    </Grid>

                    {/* Charts */}
                    <Grid item xs={12}>
                        <Paper sx={{ padding: '16px' }}>
                            <Typography variant="h6">Platos más solicitados</Typography>
                            {/* Aquí puedes agregar un gráfico de barras */}
                            <Box sx={{ height: '150px', backgroundColor: '#e0e0e0' }} />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{ padding: '16px' }}>
                            <Typography variant="h6">Categorías más populares</Typography>
                            {/* Aquí puedes agregar un gráfico de pastel */}
                            <Box sx={{ height: '150px', backgroundColor: '#e0e0e0' }} />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{ padding: '16px' }}>
                            <Typography variant="h6">Alérgenos más comunes</Typography>
                            {/* Aquí puedes agregar un gráfico de barras */}
                            <Box sx={{ height: '150px', backgroundColor: '#e0e0e0' }} />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};