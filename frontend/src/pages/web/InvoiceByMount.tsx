import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useLanguage } from '@/helpers';
import { IconText, ButtonType } from '@/components';
import { IInvoicing, IInvoicingData } from '@/interfaces'
import { getOrderDishByOrderId, createInvoice, createInvoiceData } from '@/controller';

export const InvoiceByMount = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { texts } = useLanguage();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [divisions, setDivisions] = useState<{ person: number; amount: string }[]>([]);

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const divide = parseInt(params.get("divide") || '0', 10);

        if (divide > 0 && order) {
            const { totalPrice } = calculateTotal();
            const amountPerPerson = totalPrice / divide;

            const divisions = Array.from({ length: divide }, (_, i) => ({
                person: i + 1,
                amount: amountPerPerson.toFixed(2),
            }));

            setDivisions(divisions);
        }
    }, [order, location.search]);

    const calculateTotal = () => {
        if (!order) return { totalQuantity: 0, totalPrice: 0 };

        const totalQuantity = order.reduce((acc: number, dish: any) => acc + dish.quantity, 0);
        const totalPrice = order.reduce((acc: number, dish: any) => acc + (dish.dish.price * dish.quantity), 0);

        return { totalQuantity, totalPrice };
    }

    const { totalQuantity, totalPrice } = calculateTotal();

    const handleDivideByAmount = async () => {
        const params = new URLSearchParams(location.search);
        const peopleCount = parseInt(params.get("divide") || '0', 10);
        if (peopleCount > 0 && order) {
            const { totalPrice } = calculateTotal();
            const amountPerPerson = totalPrice / peopleCount;
            const invoiceNumberBase = `${id}-${deskId}-${Date.now()}`;

            let remainingDishes = [...order];

            // Crear la factura para cada persona
            for (let i = 0; i < peopleCount; i++) {
                const invoiceNumber = `${invoiceNumberBase}-${i + 1}`;
                const invoiceData: IInvoicing = {
                    invoiceId: parseInt(invoiceNumber, 10),
                    totalPrice: parseFloat(amountPerPerson.toFixed(2)),
                    orderId: parseInt(id, 10),
                };

                const createdInvoice = await createInvoice(invoiceData);

                if (!createdInvoice || !createdInvoice.id) {
                    console.error("No se pudo crear la factura o falta el ID de la factura.", createdInvoice);
                    throw new Error("Error al crear la factura.");
                }

                const invoiceId = createdInvoice.id;

                const invoiceDataList: IInvoicingData[] = remainingDishes.map((dish: any) => {
                    const quantity = Math.ceil(dish.quantity / peopleCount);

                    if (quantity <= 0) {
                        console.error("La cantidad calculada no es válida:", quantity);
                        throw new Error("La cantidad calculada es inválida.");
                    }

                    return {
                        quantity,
                        invoiceId,
                        dishId: dish.dish.id,
                    };
                });

                for (const data of invoiceDataList) {
                    await createInvoiceData(data);
                }

                remainingDishes = remainingDishes.filter((dish: any) => dish.quantity > 0);
            }
        }
    }

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
                        {divisions.map((division, index) => (
                            <Box key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    border: `1px solid white`,
                                    borderRadius: theme.shape.borderRadius,
                                    backgroundColor: theme.background.primary,
                                }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                    {`${texts.labels.invoice} ${division.person}`}
                                </Typography>
                                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {texts.labels.totalAmount}:
                                    <span style={{
                                        color: theme.button.cafeMedio,
                                        fontSize: theme.typography.body1.fontSize,
                                        fontWeight: theme.typography.title.fontWeight,
                                    }}>${division.amount}</span>
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
                                    handleDivideByAmount()
                                        .then(() => {
                                            window.location.href = `/menu?desk_id=${deskId || ''}`;
                                        })
                                        .catch((error) => {
                                            console.error("Error al crear la factura:", error);
                                            alert(texts.alerts.invoiceCreationError);
                                        });
                                }}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.back}
                                typeButton="outlined"
                                urlLink={`/divide-invoice/${id}?desk_id=${deskId || ''}`}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
