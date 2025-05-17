import React from 'react'
import {
    Box, useTheme, FormControl, InputLabel,
    Select, MenuItem, List, ListItemText,
    Divider, ListItemButton,
    Typography, SelectChangeEvent, Drawer,
    IconButton
} from '@mui/material';
import {
    Dashboard, NoMeals, Category,
    KebabDining, DeskOutlined, LocalDining,
    HistoryEdu, DinnerDining, Logout, 
    ArrowForwardIos, BrunchDining
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GetUserAuth, LogoutAuth } from '@/controller';

export interface SideBarProps {
    onMonthChange: (month: number) => void;
}

export const SideBar = ({ onMonthChange }: SideBarProps) => {
    const theme = useTheme();
    const [user, setUser] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await GetUserAuth();
            setUser(userData);
        };
        fetchUser();
    }, []);

    const handleMonthChange = (e: SelectChangeEvent<number>) => {
        const month = Number(e.target.value);
        setSelectedMonth(month);
        onMonthChange(month);
    };

    const handleLogout = async () => {
        const success = await LogoutAuth();
        if (success) {
            navigate('/admin', { replace: true });
        } else {
            alert('Error al cerrar sesión');
        }
    };

    const renderMenuItems = (navigate: ReturnType<typeof useNavigate>, currentPath: string) => (
        [
            { key: 'Dashboard', icon: <Dashboard />, text: 'Dashboard', route: '/admin/dashboard' },
            { key: 'Mesas', icon: <DeskOutlined />, text: 'Mesas', route: '/admin/desk' },
            { key: 'Alergenos', icon: <NoMeals />, text: 'Alergenos', route: '/admin/allergen' },
            { key: 'Categorias', icon: <Category />, text: 'Categorias', route: '/admin/categories' },
            { key: 'Ingredientes', icon: <LocalDining />, text: 'Ingredientes', route: '/admin/ingredient' },
            { key: 'Platos', icon: <BrunchDining />, text: 'Platos', route: '/admin/dish' },
            { key: 'Guarniciones', icon: <KebabDining />, text: 'Guarniciones', route: '/admin/garrisons' },
            { key: 'Facturas', icon: <HistoryEdu />, text: 'Facturas', route: '/admin/invoices' },
            { key: 'Ordenes', icon: <DinnerDining />, text: 'Ordenes', route: '/admin/orders' },
        ].map(({ key, icon, text, route }, index, array) => (
            <React.Fragment key={key}> {/* Agregar key único aquí */}
                <ListItemButton
                    sx={{
                        padding: '10px 20px',
                        backgroundColor: currentPath === route ? theme.palette.action.selected : 'inherit',
                    }}
                    onClick={() => navigate(route)}
                >
                    {icon}
                    <ListItemText primary={text} />
                </ListItemButton>
                {index < array.length - 1 && <Divider />} {/* Agregar Divider entre elementos */}
            </React.Fragment>
        ))
    );

    return (
        <>
            {/* Botón para abrir el Drawer */}
            <IconButton
                sx={{ 
                    display: { xs: 'block', md: 'none' },
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    zIndex: 1000,
                    transform: 'translateY(-50%)',
                }}
                onClick={() => setIsDrawerOpen(true)}
            >
                <ArrowForwardIos />
            </IconButton>

            {/* Drawer para pantallas pequeñas */}
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Box minHeight={'100vh'} width={250} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: theme.background.secondary
                }}>
                    <Box>
                        {/* Seleccionar mes del año a buscar */}
                        <FormControl fullWidth sx={{ padding: '20px' }}>
                            <InputLabel id="select-month-label" sx={{ padding: '21px' }}>Mes</InputLabel>
                            <Select
                                labelId="select-month-label"
                                id="select-month"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                label="Mes"
                            >
                                <MenuItem value={1}>Enero</MenuItem>
                                <MenuItem value={2}>Febrero</MenuItem>
                                <MenuItem value={3}>Marzo</MenuItem>
                                <MenuItem value={4}>Abril</MenuItem>
                                <MenuItem value={5}>Mayo</MenuItem>
                                <MenuItem value={6}>Junio</MenuItem>
                                <MenuItem value={7}>Julio</MenuItem>
                                <MenuItem value={8}>Agosto</MenuItem>
                                <MenuItem value={9}>Septiembre</MenuItem>
                                <MenuItem value={10}>Octubre</MenuItem>
                                <MenuItem value={11}>Noviembre</MenuItem>
                                <MenuItem value={12}>Diciembre</MenuItem>
                            </Select>
                        </FormControl>

                        <Divider />

                        {/* Renderizar elementos del menú */}
                        <List sx={{ width: '100%', maxWidth: 360, padding: '20px' }}>
                            {renderMenuItems(navigate, window.location.pathname)}
                        </List>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                    }}>
                        <Typography variant="body2" sx={{
                            textAlign: 'center',
                            color: theme.menu.black,
                        }}>
                            {user ? `Bienvenido ${user.username}` : 'Cargando...'}
                        </Typography>
                        <Logout
                            sx={{
                                cursor: 'pointer',
                                color: theme.menu.black,
                            }}
                            onClick={handleLogout}
                        />
                    </Box>
                </Box>
            </Drawer>

            {/* SideBar fijo para pantallas grandes */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: 250,
                    backgroundColor: theme.background.secondary,
                    height: '100vh',
                }}
            >
                <Box>
                    {/* Seleccionar mes del año a buscar */}
                    <FormControl fullWidth sx={{ padding: '20px' }}>
                        <InputLabel id="select-month-label" sx={{ padding: '21px' }}>Mes</InputLabel>
                        <Select
                            labelId="select-month-label"
                            id="select-month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            label="Mes"
                        >
                            <MenuItem value={1}>Enero</MenuItem>
                            <MenuItem value={2}>Febrero</MenuItem>
                            <MenuItem value={3}>Marzo</MenuItem>
                            <MenuItem value={4}>Abril</MenuItem>
                            <MenuItem value={5}>Mayo</MenuItem>
                            <MenuItem value={6}>Junio</MenuItem>
                            <MenuItem value={7}>Julio</MenuItem>
                            <MenuItem value={8}>Agosto</MenuItem>
                            <MenuItem value={9}>Septiembre</MenuItem>
                            <MenuItem value={10}>Octubre</MenuItem>
                            <MenuItem value={11}>Noviembre</MenuItem>
                            <MenuItem value={12}>Diciembre</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider />

                    {/* Renderizar elementos del menú */}
                    <List sx={{ width: '100%', maxWidth: 360, padding: '20px' }}>
                        {renderMenuItems(navigate, window.location.pathname)}
                    </List>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                }}>
                    <Typography variant="body2" sx={{
                        textAlign: 'center',
                        color: theme.menu.black,
                    }}>
                        {user ? `Bienvenido ${user.username}` : 'Cargando...'}
                    </Typography>
                    <Logout
                        sx={{
                            cursor: 'pointer',
                            color: theme.menu.black,
                        }}
                        onClick={handleLogout}
                    />
                </Box>
            </Box>
        </>
    );
};