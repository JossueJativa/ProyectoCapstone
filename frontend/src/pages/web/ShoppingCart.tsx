import { useEffect, useState } from 'react';
import { Box, Grid, Typography, useTheme, CircularProgress } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

import { useSocket, useLanguage } from "@/helpers";
import { IconText, CartBox, ButtonType, PopUpInformation } from '@/components';
import { getDish, createOrder, createOrderDish, getGarrison } from '@/controller';

export const ShoppingCart = () => {
    const theme = useTheme();
    const { texts, language } = useLanguage();
    const { socket } = useSocket();
    const location = useLocation();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [cartDishes, setCartDishes] = useState<any[]>([]);
    const [fetchedDishIds, setFetchedDishIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [showPopUp, setShowPopUp] = useState(false);
    const [invoiceId, setInvoiceId] = useState(Number);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (socket && desk_id) {
            const fetchCartDishes = () => {
                socket.emit("order:get", { desk_id }, (error: any, orderDetails: any[]) => {
                    if (error) {
                        console.error("Error fetching cart details:", error);
                        return;
                    }
                    if (orderDetails.length === 0) {
                        setLoading(false);
                    }
                    mergeCartDishes(orderDetails);
                });
            };

            const handleCartUpdate = (orderDetails: any[]) => {
                mergeCartDishes(orderDetails);
            };

            fetchCartDishes();

            socket.on(`order:details`, handleCartUpdate);

            return () => {
                socket.off(`order:details`, handleCartUpdate);
            };
        }
    }, [socket, location.search]);

    useEffect(() => {
        if (socket && deskId) {
            const handleCartUpdate = (orderDetails: any[]) => {
                mergeCartDishes(orderDetails); // Replace cart with the latest data
            };

            socket.on(`order:details`, handleCartUpdate);

            return () => {
                socket.off(`order:details`, handleCartUpdate);
            };
        }
    }, [socket, deskId]);

    useEffect(() => {
        const fetchDishDetails = async () => {
            const newDishes = cartDishes.filter(dish => !fetchedDishIds.has(dish.id));
            if (newDishes.length === 0) {
                setLoading(false);
                return;
            }

            const updatedDishes = await Promise.all(
                newDishes.map(async (dish) => {
                    if (!dish.details) {
                        const dishDetails = await getDish(dish.product_id, language); // Pasar el idioma al método getDish
                        return {
                            ...dish,
                            details: dishDetails,
                        };
                    }
                    return dish;
                })
            );

            setCartDishes(prevDishes => [...prevDishes, ...updatedDishes]);

            setFetchedDishIds(prevIds => {
                const newIds = new Set(prevIds);
                newDishes.forEach(dish => newIds.add(dish.id));
                return newIds;
            });

            setLoading(false);
        };

        if (cartDishes.length > 0) {
            fetchDishDetails();
        }
    }, [cartDishes]);

    useEffect(() => {
        if (socket && deskId) {
            const handleDeleteAll = () => {
                setCartDishes([]);
            };

            socket.on("order:delete:all", handleDeleteAll);

            return () => {
                socket.off("order:delete:all", handleDeleteAll);
            };
        }
    }, [socket, deskId]);

    useEffect(() => {
        const updateDishDetailsOnLanguageChange = async () => {
            if (cartDishes.length > 0) {
                const updatedDishes = await Promise.all(
                    cartDishes.map(async (dish) => {
                        const dishDetails = await getDish(dish.product_id, language);
                        return {
                            ...dish,
                            details: dishDetails,
                        };
                    })
                );
                setCartDishes(updatedDishes);
            }
        };

        updateDishDetailsOnLanguageChange();
    }, [language]);

    const mergeCartDishes = async (newDishes: any[]) => {
        const updatedDishes = await Promise.all(
            newDishes.map(async (dish) => {
                let garrisonDetails = null;

                if (dish.garrison && Array.isArray(dish.garrison)) {
                    garrisonDetails = await Promise.all(
                        dish.garrison.map(async (garrisonId: number) => {
                            const lang = language === "en" ? "EN-GB" : "ES";
                            const garrisonData = await getGarrison(garrisonId, lang);
                            return garrisonData.garrison_name;
                        })
                    );
                }

                const dishDetails = await getDish(dish.product_id, language); // Pasar el idioma al método getDish
                return { ...dish, details: dishDetails, garrisonDetails };
            })
        );

        setCartDishes(updatedDishes);

        setFetchedDishIds(new Set(newDishes.map((dish) => dish.id)));
    };

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setCartDishes(prevDishes =>
            prevDishes.map(dish =>
                dish.id === id ? { ...dish, quantity: newQuantity } : dish
            )
        );
    };

    const handleDelete = (id: number) => {
        setCartDishes(prevDishes => prevDishes.filter(dish => dish.id !== id)); // Remove item locally
        if (deskId && socket) {
            socket.emit("order:delete", { order_detail_id: id, desk_id: deskId }, (error: any) => {
                if (error) {
                    console.error("Error deleting item:", error);
                }
            });
        }
    };

    const calculateSummary = () => {
        const totalQuantity = cartDishes.reduce((sum, dish) => sum + dish.quantity, 0);
        const totalPrice = cartDishes.reduce((sum, dish) => sum + dish.quantity * dish.details.price, 0);
        return { totalQuantity, totalPrice };
    };

    const handleMakeOrder = async () => {
        if (deskId && socket) {
            try {
                const order = await createOrder({
                    deskId: deskId,
                    totalPrice: calculateSummary().totalPrice,
                    status: 'Pendiente',
                })

                const OrderId = order.id;
                setInvoiceId(OrderId);

                await Promise.all(
                    cartDishes.map(async (dish) => {
                        const orderDishResponse = await createOrderDish({
                            dishId: dish.details.id,
                            quantity: dish.quantity,
                            order: OrderId,
                        });
                        return orderDishResponse.id;
                    })
                );

                socket.emit("order:delete:all", { desk_id: deskId }, (error: any) => {
                    if (error) {
                        console.error("Error deleting all items:", error);
                    }
                });

                setShowPopUp(true);
            } catch (error) {
                console.error("Error creating order:", error);
            }
        }
    };

    const { totalQuantity, totalPrice } = calculateSummary();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (cartDishes.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Box sx={{ flex: 1, padding: '15px' }}>
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

                    {/* Summary Section */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid white`,
                        borderRadius: theme.shape.borderRadius,
                        padding: '10px',
                        marginBottom: '20px',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {texts.labels.itemsCount}:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.button.cafeMedio,
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.title.fontWeight,
                            }}>
                                0
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {texts.labels.totalAmount}:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.button.cafeMedio,
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.title.fontWeight,
                            }}>
                                $0.00
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
                            {texts.labels.emptyCart}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{
                    marginTop: 'auto',
                    width: '100%',
                    position: 'fixed',
                    bottom: '0',
                    mb: '29px',
                }}>
                    <Box sx={{
                        borderRadius: theme.shape.borderRadius,
                        borderTop: '2px solid white',
                        padding: '10px',
                    }}>
                        <Box sx={{ marginBottom: '10px' }}>
                            <ButtonType
                                text={texts.buttons.makeOrder}
                                typeButton="primary"
                                onClick={() => {
                                    handleMakeOrder();
                                }}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.back}
                                typeButton="outlined"
                                urlLink={`/menu?desk_id=${deskId || ''}`}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
                <Box sx={{ flex: 1, padding: '15px' }}>
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

                    {/* Summary Section */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid white`,
                        borderRadius: theme.shape.borderRadius,
                        padding: '10px',
                        marginBottom: '20px',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {texts.labels.itemsCount}:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.button.cafeMedio,
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.title.fontWeight,
                            }}>
                                {totalQuantity}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {texts.labels.totalAmount}:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.button.cafeMedio,
                                fontSize: theme.typography.body1.fontSize,
                                fontWeight: theme.typography.title.fontWeight,
                            }}>
                                ${totalPrice.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

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
                                        linkTo={`/dish/${dish.details.id}?desk_id=${deskId}`}
                                        onQuantityChange={handleQuantityChange}
                                        onDelete={() => handleDelete(dish.id)}
                                        garrisons={dish.garrisonDetails ? dish.garrisonDetails.join(', ') : ''}
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                        <CircularProgress />
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box sx={{
                    marginTop: 'auto',
                    width: '100%',
                    bottom: '0',
                }}>
                    <Box sx={{
                        borderRadius: theme.shape.borderRadius,
                        borderTop: '2px solid white',
                        padding: '10px',
                    }}>
                        <Box sx={{ marginBottom: '10px' }}>
                            <ButtonType
                                text={texts.buttons.makeOrder}
                                typeButton="primary"
                                onClick={() => {
                                    handleMakeOrder();
                                }}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.back}
                                typeButton="outlined"
                                urlLink={`/menu?desk_id=${deskId || ''}`}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <PopUpInformation
                open={showPopUp}
                isInformative={true}
                message={texts.labels.orderSuccess}
                redirect={`/invoice/${invoiceId}?desk_id=${deskId || ''}`}
            />
        </>
    );
};
