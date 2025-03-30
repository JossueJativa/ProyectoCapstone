import { useEffect, useState } from 'react';
import { Box, Grid, Typography, useTheme, CircularProgress } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

import { useSocket, useLanguage } from "@/helpers";
import { IconText, CartBox } from '@/components';
import { getDish } from '@/controller';

export const ShoppingCart = () => {
    const theme = useTheme();
    const { texts } = useLanguage();
    const { socket } = useSocket();
    const location = useLocation();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [cartDishes, setCartDishes] = useState<any[]>([]);
    const [fetchedDishIds, setFetchedDishIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(true); // Estado de carga

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (socket && desk_id) {
            const fetchCartDishes = () => {
                console.log("Fetching initial cart details for desk_id:", desk_id); // Debug log
                socket.emit("order:get", { desk_id }, (error: any, orderDetails: any[]) => {
                    if (error) {
                        console.error("Error fetching cart details:", error);
                        return;
                    }
                    console.log("Initial cart details fetched:", orderDetails); // Debug log
                    mergeCartDishes(orderDetails);
                });
            };

            const handleCartUpdate = (orderDetails: any[]) => {
                console.log("Real-time cart update received:", orderDetails); // Debug log
                mergeCartDishes(orderDetails);
            };

            // Fetch initial cart dishes
            fetchCartDishes();

            // Listen for real-time updates
            console.log("Listening for real-time updates on desk_id:", desk_id); // Debug log
            socket.on(`order:details`, handleCartUpdate);

            return () => {
                console.log("Stopping real-time updates listener for desk_id:", desk_id); // Debug log
                socket.off(`order:details`, handleCartUpdate);
            };
        }
    }, [socket, location.search]);

    useEffect(() => {
        if (socket && deskId) {
            const handleCartUpdate = (orderDetails: any[]) => {
                console.log("Real-time cart update received (deskId effect):", orderDetails); // Debug log
                reloadCartData(); // Reload cart data on new socket event
            };

            // Listen for real-time updates
            console.log("Listening for real-time updates (deskId effect) on desk_id:", deskId); // Debug log
            socket.on(`order:details`, handleCartUpdate);

            return () => {
                console.log("Stopping real-time updates listener (deskId effect) for desk_id:", deskId); // Debug log
                socket.off(`order:details`, handleCartUpdate);
            };
        }
    }, [socket, deskId]);

    const mergeCartDishes = (newDishes: any[]) => {
        console.log("Merging cart dishes with new data:", newDishes); // Debug log
        setCartDishes(prevDishes => {
            const dishMap = new Map(prevDishes.map(dish => [dish.product_id, dish]));
            newDishes.forEach(dish => {
                if (dishMap.has(dish.product_id)) {
                    dishMap.set(dish.product_id, { ...dishMap.get(dish.product_id), ...dish });
                } else {
                    dishMap.set(dish.product_id, dish);
                }
            });
            const updatedDishes = Array.from(dishMap.values());
            console.log("Updated cart dishes:", updatedDishes); // Debug log
            return updatedDishes; // Ensure state is updated with a new array reference
        });
    };

    const reloadCartData = () => {
        if (deskId && socket) {
            console.log("Reloading cart data for desk_id:", deskId); // Debug log
            socket.emit("order:get", { desk_id: deskId }, (error: any, orderDetails: any[]) => {
                if (error) {
                    console.error("Error reloading cart data:", error);
                    return;
                }
                console.log("Reloaded cart data:", orderDetails); // Debug log
                mergeCartDishes(orderDetails);
            });
        }
    };

    // Log `cartDishes` whenever it changes
    useEffect(() => {
        console.log("cartDishes state updated:", cartDishes); // Debug log
    }, [cartDishes]);

    useEffect(() => {
        const fetchDishDetails = async () => {
            const newDishes = cartDishes.filter(dish => !fetchedDishIds.has(dish.product_id));
            if (newDishes.length === 0) {
                setLoading(false); // Detener la carga si no hay nuevos platos
                return;
            }

            const updatedDishes = await Promise.all(
                newDishes.map(async (dish) => {
                    const dishDetails = await getDish(dish.product_id);
                    console.log("Fetched dish details:", dishDetails);
                    return {
                        ...dish,
                        details: dishDetails,
                    };
                })
            );

            setCartDishes(prevDishes => {
                const updatedDishMap = new Map(prevDishes.map(d => [d.product_id, d]));
                updatedDishes.forEach(d => updatedDishMap.set(d.product_id, d));
                return Array.from(updatedDishMap.values());
            });

            setFetchedDishIds(prevIds => {
                const newIds = new Set(prevIds);
                newDishes.forEach(dish => newIds.add(dish.product_id));
                return newIds;
            });

            setLoading(false); // Detener la carga después de obtener los detalles
        };

        if (cartDishes.length > 0) {
            fetchDishDetails();
        }
    }, [cartDishes]);

    const handleQuantityChange = (id: number, newQuantity: number) => {
        console.log("Updating quantity locally for order_detail_id:", id, "to new quantity:", newQuantity); // Debug log
        setCartDishes(prevDishes =>
            prevDishes.map(dish =>
                dish.id === id ? { ...dish, quantity: newQuantity } : dish
            )
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
            {/* Render cart dishes */}
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
            <Box>
                {cartDishes.map((dish, index) => (
                    <Box key={index} sx={{ marginBottom: '10px' }}>
                        {dish.details ? (
                            <CartBox
                                id={dish.id}
                                dish_name={dish.details.dish_name}
                                description={dish.details.description}
                                price={dish.details.price}
                                quantity={dish.quantity}
                                linkAR={dish.details.link_ar}
                                desk_id={deskId}
                                onQuantityChange={handleQuantityChange} // Pass callback
                            />
                        ) : (
                            <Typography color="error">Error: Missing dish details</Typography>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
