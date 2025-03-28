import { useParams, useLocation } from 'react-router-dom';
import { useTheme, Box, Grid, Typography, Skeleton } from '@mui/material';
import { 
    RoomService, Egg
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { Error404 } from '../errors';
import { IconText, DishBox } from '@/components';
import { useSocket, useLanguage } from "@/helpers";
import { getDish, getAllergensByDish } from '@/controller';

export const DishSelected = () => {
    const { dishId } = useParams<{ dishId: string }>();
    const { texts } = useLanguage();
    const { socket } = useSocket();
    const theme = useTheme();
    const location = useLocation();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [dish, setDish] = useState<any>(null);
    const [allergens, setAllergens] = useState<any[]>([]);

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

    useEffect(() => {
        const fetchDish = async () => {
            const dish = await getDish(dishId);
            setDish(dish);
        };
        fetchDish();
    }, [dishId]);

    useEffect(() => {
        const fetchAllergens = async () => {
            if (dish) {
                const allergens = await getAllergensByDish(dishId);
                setAllergens(allergens);
            }
        }
        fetchAllergens();
    }, [dish]);

    if (!dishId) {
        return <Error404 />;
    }

    if (!dish) {
        return (
            <Box sx={{ padding: '15px' }}>
                <Grid container spacing={2} pb={2}>
                    <Grid item xs={8}>
                        <Skeleton variant="text" width="60%" height={40} />
                    </Grid>
                    <Grid item xs={4}>
                        <Skeleton variant="rectangular" height={40} />
                    </Grid>
                </Grid>
                <Skeleton variant="rectangular" height={200} sx={{ marginBottom: 2 }} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
            <Grid container spacing={2} pb={2}>
                <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconText icon={<RoomService />} text={texts.labels.dishes} />
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

            <DishBox
                name={dish.dish_name}
                price={dish.price}
                description={dish.description}
                linkAR={dish.link_ar}
                allergens={allergens}
            />
        </Box>
    );
};
