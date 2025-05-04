import { Grid, Box, useTheme, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart,
    Pie, Cell, Legend
} from 'recharts';
import { SideBar, BoxData } from '@/components';
import { getOrders, getDish, getOrderDishByOrderId, getCategories } from '@/controller';
import { IOrder } from '@/interfaces';

export const Dashboard = () => {
    const theme = useTheme();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [dishes, setDishes] = useState<{ name: string; count: number }[]>([]);
    const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
    const [totalDishes, setTotalDishes] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [averageDishesPerTable, setAverageDishesPerTable] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const filteredOrders = orders.filter(order => {
                    const [year, day, month] = order.date.split('-');
                    const formattedDate = `${year}-${month}-${day}`;
                    const orderDate = new Date(formattedDate);

                    return orderDate.getFullYear() === currentYear && orderDate.getMonth() + 1 === selectedMonth;
                });

                const totalDishes = filteredOrders.reduce((sum, order) => sum + order.order_dish.length, 0);
                const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_price, 0);
                const averageDishesPerTable = filteredOrders.length > 0
                    ? (totalDishes / filteredOrders.length).toFixed(2)
                    : 0;

                setTotalDishes(totalDishes);
                setTotalRevenue(totalRevenue);
                setAverageDishesPerTable(averageDishesPerTable);

                const dishCounts: Record<string, number> = {};
                for (const order of filteredOrders) {
                    const orderDishes = await getOrderDishByOrderId(order.id);

                    for (const dishId of orderDishes) {
                        const dishQuantity = dishId.quantity;
                        const dishName = dish.dish_name;

                        if (dishCounts[dishName]) {
                            dishCounts[dishName] += dishQuantity;
                        } else {
                            dishCounts[dishName] = dishQuantity;
                        }
                    }
                }
                const dishArray = Object.entries(dishCounts).map(([name, count]) => ({ name, count }));
                dishArray.sort((a, b) => b.count - a.count);
                setDishes(dishArray);

                const categoryCounts: Record<string, number> = {};
                const categoriesData = await getCategories();
                const categoryMap = categoriesData.reduce((map, category) => {
                    map[category.id] = category.category_name;
                    return map;
                }, {} as Record<number, string>);

                for (const order of filteredOrders) {
                    const orderDishes = await getOrderDishByOrderId(order.id);

                    for (const dishId of orderDishes) {
                        const dish = await getDish(dishId.dish.id);
                        const categoryDish = dish.category;

                        const categoryName = categoryMap[categoryDish];
                        const dishQuantity = dishId.quantity;

                        if (categoryCounts[categoryName]) {
                            categoryCounts[categoryName] += dishQuantity;
                        } else {
                            categoryCounts[categoryName] = dishQuantity;
                        }
                    }
                }

                const categoryArray = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
                setCategories(categoryArray);
            } catch (error) {
                console.error('Error fetching filtered data:', error);
            }
        };

        if (orders.length > 0) {
            fetchFilteredData();
        }
    }, [orders, selectedMonth]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: theme.background.primary, minHeight: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ width: 'auto' }}>
                {/* Columna derecha: SideBar */}
                <Grid container width={'20%'}>
                    <SideBar onMonthChange={setSelectedMonth} />
                </Grid>

                {/* Columna izquierda: Contenido principal */}
                <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <BoxData>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <Typography variant="h6">Total Platos</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalDishes}</Typography>
                                </Box>
                            </BoxData>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <BoxData>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <Typography variant="h6">Ganancias Totales</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {totalRevenue}
                                    </Typography>
                                </Box>
                            </BoxData>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <BoxData>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <Typography variant="h6">Media de pedidos por mesa</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {averageDishesPerTable}
                                    </Typography>
                                </Box>
                            </BoxData>
                        </Grid>
                        <Grid item xs={12}>
                            <BoxData>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                                    <Typography variant="h6" sx={{ marginBottom: '20px' }}>Platos Más Pedidos</Typography>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={dishes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </BoxData>
                        </Grid>

                        {/* Gráfico de pastel */}
                        <Grid item xs={12}>
                            <BoxData>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                                    <Typography variant="h6" sx={{ marginBottom: '20px' }}>Categorías Más Compradas</Typography>
                                    <ResponsiveContainer width="100%" height={200}> {/* Ajuste de altura */}
                                        <PieChart>
                                            <Pie
                                                data={categories}
                                                dataKey="count"
                                                nameKey="name"
                                                cx="50%" // Centrar el gráfico horizontalmente
                                                cy="50%" // Centrar el gráfico verticalmente
                                                outerRadius={80} // Ajuste del radio
                                                fill="#8884d8"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Mostrar nombre y porcentaje
                                            >
                                                {categories.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Legend layout="vertical" align="left" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </BoxData>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};