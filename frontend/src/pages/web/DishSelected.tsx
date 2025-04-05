import { useParams, useLocation } from 'react-router-dom';
import { useTheme, Box, Grid, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

import { Error404 } from '../errors';
import { DishBox, ButtonType, CartButton } from '@/components';
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
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <DishBox
                    name={dish.dish_name}
                    price={dish.price}
                    description={dish.description}
                    linkAR={dish.link_ar}
                    allergens={allergens}
                    dish_id={dish.id}
                    has_garrison={dish.has_garrison}
                />
            </Box>
            <Box sx={{
                marginTop: '20px',
                width: '100%',
                bottom: '0',
                pb: '40px',
            }}>
                <Box sx={{
                    borderRadius: theme.shape.borderRadius,
                    borderTop: '2px solid white',
                    padding: '10px',
                }}>
                    <ButtonType 
                        text={texts.buttons.back} 
                        typeButton="outlined" 
                        urlLink={`/menu?desk_id=${deskId || ''}`} // Use urlLink instead of navigate
                    />
                </Box>
            </Box>
            <CartButton />
        </>
    );
};
