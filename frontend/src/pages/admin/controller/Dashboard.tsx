import { Grid, Box, useTheme, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart,
    Pie, Cell, Legend
} from 'recharts';
import { SideBar, BoxData } from '@/components';
import { getDashboardInformation } from '@/controller';

export const Dashboard = () => {
    const theme = useTheme();
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [dishes, setDishes] = useState<{ name: string; count: number }[]>([]);
    const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
    const [totalDishes, setTotalDishes] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [averageDishesPerTable, setAverageDishesPerTable] = useState(0);

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const responseData = await getDashboardInformation(currentYear, selectedMonth);
                const { dashboard_statistics } = responseData;

                setTotalDishes(dashboard_statistics.total_dishes);
                setTotalRevenue(dashboard_statistics.total_revenue);
                setAverageDishesPerTable(Number(dashboard_statistics.average_dishes_per_table));
                setDishes(dashboard_statistics.dishes.map((dish: any) => ({
                    name: dish.dish__dish_name,
                    count: dish.count
                })));
                setCategories(dashboard_statistics.categories.map((category: any) => ({
                    name: category.dish__category__category_name,
                    count: category.count
                })));
            } catch (error) {
                console.error('Error fetching dashboard info:', error);
            }
        };

        fetchDashboardInfo();
    }, [selectedMonth]);

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
                                        {totalRevenue.toFixed(2)} $
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
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={categories}
                                                dataKey="count"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categories.map((_entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Legend layout="vertical" align="left" />
                                </Box>
                            </BoxData>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};