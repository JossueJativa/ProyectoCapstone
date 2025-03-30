import { useEffect, useState } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

import { useSocket, useLanguage } from "@/helpers";
import { IconText } from '@/components';


export const ShoppingCart = () => {
    const theme = useTheme();
    const { texts } = useLanguage();
    const { socket } = useSocket();
    const location = useLocation();
    const [deskId, setDeskId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (socket && desk_id) {
            const handleDeskNotification = (notification: any) => {
                console.log(`📢 Notification for desk_${desk_id}:`, notification);
            };

            socket.on(`desk:notification:${desk_id}`, handleDeskNotification);

            return () => {
                socket.off(`desk:notification:${desk_id}`, handleDeskNotification);
            };
        }
    }, [socket, location.search]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
            <Grid container spacing={2} pb={2}>
                <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconText icon={<ShoppingCartIcon />} text={texts.buttons.cart} />
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: theme.background.primary,
                        borderRadius: theme.shape.borderRadius,
                    }}>
                        <Typography variant="h6" sx={{
                            fontSize: theme.typography.body1.fontSize,
                            fontWeight: theme.typography.body1.fontWeight,
                            padding: '3px',
                        }}>
                            {deskId ? `${texts.labels.desk}: ${deskId}` : `${texts.labels.noDesk}`}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
