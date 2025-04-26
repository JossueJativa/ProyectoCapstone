import { Grid, Box, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { getIngredients, createIngredient } from '@/controller';

export const CreateIngredient = () => {
    const theme = useTheme();
    const [ingredient, setIngredient] = useState<any>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);

    useEffect(() => {
        const fetchIngredient = async () => {
            const response = await getIngredients(selectedMonth);
            setIngredient(response.data);
        }
        fetchIngredient();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: theme.background.primary, minHeight: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar onMonthChange={setSelectedMonth} />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px' }}>
                    {/* Parte izquierda es agregar mesas */}

                    {/* Parte derecha es ver las mesas */}
                </Grid>
            </Grid>
        </Box>
    )
}
