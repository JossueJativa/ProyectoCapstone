import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useLanguage } from '@/helpers';
import { IconText, ButtonType, PopUpInformation } from '@/components';
import { getOrderDishByOrderId, createInvoice, createInvoiceData } from '@/controller';
import { IInvoicing, IInvoicingData } from '@/interfaces';

export const Invoicing = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { texts } = useLanguage();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (id) { // Verifica que el ID de la factura exista
            const fetchData = async () => {
                const orderDishes = await getOrderDishByOrderId(id ? parseInt(id, 10) : 0);
                setOrder(orderDishes);
            };
            fetchData();
        }
    }, [id, location.search]);

    const handleMakeInvoice = async () => {
        if (order && order.length > 0) {
            const invoiceNumberBase = `${id}-${deskId}-${Date.now()}`;
            const invoiceNumber = `${invoiceNumberBase}-1`;

            const totalPrice = order.reduce((acc: number, dish: any) => acc + dish.dish.price * dish.quantity, 0);
            const invoiceData: IInvoicing = {
                invoiceId: parseInt(invoiceNumber, 10),
                totalPrice: parseFloat(totalPrice.toFixed(2)),
                orderId: parseInt(id || '0', 10),
            };

            const createdInvoice = await createInvoice(invoiceData);

            if (!createdInvoice || !createdInvoice.id) {
                console.error("No se pudo crear la factura o falta el ID de la factura.", createdInvoice);
                throw new Error("Error al crear la factura.");
            }

            const invoiceId = createdInvoice.id;

            const invoiceDataList: IInvoicingData[] = order.map((dish: any) => {
                return {
                    quantity: dish.quantity,
                    invoiceId,
                    dishId: dish.dish.id,
                };
            });

            for (const data of invoiceDataList) {
                await createInvoiceData(data);
            }

            // Show popup after successful invoice creation
            setPopupOpen(true);
        } else {
            console.error("No hay platos para facturar.");
        }
    };

    const totalQuantity = order ? order.reduce((acc: number, dish: any) => acc + dish.quantity, 0) : 0;
    const totalPrice = order ? order.reduce((acc: number, dish: any) => acc + dish.dish.price * dish.quantity, 0) : 0;

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
                                fontSize: theme.customTypography.body1.fontSize,
                                fontWeight: theme.customTypography.title.fontWeight,
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
                                fontSize: theme.customTypography.body1.fontSize,
                                fontWeight: theme.customTypography.title.fontWeight,
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
                                    fontSize: theme.customTypography.body1.fontSize,
                                    fontWeight: theme.customTypography.title.fontWeight,
                                    textAlign: 'center',
                                    flex: 0.5
                                }}>
                                    {dish.quantity}
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: theme.button.cafeMedio,
                                    fontSize: theme.customTypography.body1.fontSize,
                                    fontWeight: theme.customTypography.title.fontWeight,
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
                                onClick={handleMakeInvoice}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.divideAccount}
                                typeButton="outlined"
                                urlLink={`/divide-invoice/${id}?desk_id=${deskId || ''}`}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <PopUpInformation
                open={popupOpen}
                title={texts.labels.invoiceCreated}
                message={texts.labels.invoiceCreatedMessage}
                isInformative
                redirect={`/menu?desk_id=${deskId || ''}`}
            />
        </>
    )
}
