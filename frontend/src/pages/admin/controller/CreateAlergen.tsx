import { Grid, Box, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { getAllergens, createAllergen } from '@/controller';

export const CreateAlergen = () => {
    const theme = useTheme();
    const [allergen, setAllergen] = useState<any>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);

    useEffect(() => {
        const fetchAllergen = async () => {
            const response = await getAllergens(selectedMonth);
            setAllergen(response.data);
        }
        fetchAllergen();
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
