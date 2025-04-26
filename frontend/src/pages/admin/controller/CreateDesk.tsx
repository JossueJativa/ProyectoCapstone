import { Grid, Box, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { getDesk, createDesk } from '@/controller';

export const CreateDesk = () => {
    const theme = useTheme();
    const [desk, setDesk] = useState<any>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);

    useEffect(() => {
        const fetchDesk = async () => {
            const response = await getDesk(selectedMonth);
            setDesk(response.data);
        }
        fetchDesk();
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
