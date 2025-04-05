import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useLanguage } from '@/helpers';
import { IconText, ButtonType } from '@/components';
import { getOrderDishByOrderId } from '@/controller';

export const Invoicing = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { texts } = useLanguage();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (id) { // Verifica que el ID de la factura exista
            const fetchData = async () => {
                const orderDishes = await getOrderDishByOrderId(id);
                setOrder(orderDishes);
            };
            fetchData();
        }
    }, [id, location.search]);

    const calculateTotal = () => {
        if (!order) return { totalQuantity: 0, totalPrice: 0 };

        const totalQuantity = order.reduce((acc: number, dish: any) => acc + dish.quantity, 0);
        const totalPrice = order.reduce((acc: number, dish: any) => acc + (dish.dish.price * dish.quantity), 0);

        return { totalQuantity, totalPrice };
    }

    const { totalQuantity, totalPrice } = calculateTotal();

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
                <Box sx={{ flex: 1, padding: '15px' }}>
                    <Grid container spacing={2} pb={2}>
                        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconText icon={<ShoppingCart />} text={texts.labels.dishes} />
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

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {order && order.map((dish: any, index: number) => (
                            <Box key={index} sx={{
                                display: 'flex',
                                padding: '10px',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '5px',
                                border: `1px solid white`,
                                borderRadius: theme.shape.borderRadius,
                                backgroundColor: theme.background.primary,
                            }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 2 }}>
                                    {dish.dish.name}
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: theme.button.cafeMedio,
                                    fontSize: theme.typography.body1.fontSize,
                                    fontWeight: theme.typography.title.fontWeight,
                                    textAlign: 'center',
                                    flex: 0.5
                                }}>
                                    {dish.quantity}
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: theme.button.cafeMedio,
                                    fontSize: theme.typography.body1.fontSize,
                                    fontWeight: theme.typography.title.fontWeight,
                                    textAlign: 'right',
                                    flex: 1
                                }}>
                                    ${dish.dish.price.toFixed(2)}
                                </Typography>
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
                                text={texts.buttons.makeInvoice}
                                typeButton="primary"
                                onClick={() => {
                                    console.log('Realizar pedido');
                                }}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.divideAccount}
                                typeButton="outlined"
                                urlLink={`/menu?desk_id=${deskId || ''}`}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
