import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme, Checkbox } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useLanguage } from '@/helpers';
import { IconText, ButtonType } from '@/components';
import { IInvoicing, IInvoicingData } from '@/interfaces'
import { getOrderDishByOrderId, createInvoice, createInvoiceData } from '@/controller';

export const InvoiceByDish = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { texts } = useLanguage();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [divisions, setDivisions] = useState<{ person: number; amount: string }[]>([]);
    const [selectedDishes, setSelectedDishes] = useState<any[]>([]);
    const [currentPerson, setCurrentPerson] = useState<number>(1);
    const [invoices, setInvoices] = useState<IInvoicing[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (id) {
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

    const calculateTotal = (dishes = order) => {
        if (!dishes) return { totalQuantity: 0, totalPrice: 0 };

        const totalQuantity = dishes.reduce((acc: number, dish: any) => acc + dish.quantity, 0);
        const totalPrice = dishes.reduce((acc: number, dish: any) => acc + (dish.dish.price * dish.quantity), 0);

        return { totalQuantity, totalPrice };
    }

    const handleCheckboxChange = (dish: any) => {
        if (selectedDishes.includes(dish)) {
            setSelectedDishes(selectedDishes.filter((d) => d !== dish));
        } else {
            setSelectedDishes([...selectedDishes, dish]);
        }
    };

    const finalizeInvoice = () => {
        const { totalQuantity, totalPrice } = calculateTotal(selectedDishes);
        setInvoices([...invoices, { person: currentPerson, dishes: selectedDishes, totalQuantity, total: totalPrice }]);
        setSelectedDishes([]);
        setCurrentPerson(currentPerson + 1);
    };

    const goBack = () => {
        if (currentPerson > 1) {
            const previousInvoice = invoices.pop();
            setInvoices([...invoices]);
            setSelectedDishes(previousInvoice?.dishes || []);
            setCurrentPerson(currentPerson - 1);
        }
    };

    const finishInvoices = async () => {
        if (invoices.length > 0) {
            const invoiceNumberBase = `${id}-${deskId}-${Date.now()}`;

            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                const invoiceNumber = `${invoiceNumberBase}-${i + 1}`;
                const invoiceData: IInvoicing = {
                    invoiceId: parseInt(invoiceNumber, 10),
                    totalPrice: parseFloat(invoice.total.toFixed(2)),
                    orderId: parseInt(id, 10),
                };

                const createdInvoice = await createInvoice(invoiceData);

                if (!createdInvoice || !createdInvoice.id) {
                    throw new Error("Error al crear la factura.");
                }

                const invoiceId = createdInvoice.id;

                const invoiceDataList: IInvoicingData[] = invoice.dishes.map((dish: any) => {
                    return {
                        quantity: dish.quantity,
                        invoiceId,
                        dishId: dish.dish.id,
                    };
                });

                for (const data of invoiceDataList) {
                    await createInvoiceData(data);
                }
            }
        } else {
            console.error("No hay facturas para procesar.");
        }
    };

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
                    {currentPerson <= divisions.length && (
                        <Box>
                            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                                {texts.labels.selectItem} {currentPerson}
                            </Typography>
                            {order && order.map((dish: any, index: number) => (
                                <Box key={index} sx={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    borderRadius: theme.shape.borderRadius,
                                    backgroundColor: theme.background.primary,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={selectedDishes.includes(dish)}
                                            onChange={() => handleCheckboxChange(dish)}
                                        />
                                        <Typography>{dish.dish.name}</Typography>
                                    </Box>
                                    <Typography sx={{ color: 'brown', fontWeight: 'bold' }}>${dish.dish.price.toFixed(2)}</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {currentPerson > divisions.length && currentPerson <= divisions.length + 1 && (
                        <>
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
                            <Box sx={{ marginTop: '20px' }}>
                                {invoices.map((invoice, index) => (
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
                                            {texts.labels.invoice} {invoice.person}
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {texts.labels.totalAmount}:
                                            <span style={{
                                                color: theme.button.cafeMedio,
                                                fontSize: theme.typography.body1.fontSize,
                                                fontWeight: theme.typography.title.fontWeight,
                                            }}>${invoice.total.toFixed(2)}</span>
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </>
                    )}
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
                                text={currentPerson > divisions.length ? texts.buttons.makeInvoice : texts.buttons.continue}
                                typeButton="primary"
                                onClick={() => {
                                    if (currentPerson > divisions.length) {
                                        if (currentPerson === divisions.length + 1) {
                                            finishInvoices();
                                        } else {
                                            finalizeInvoice();
                                        }
                                    } else {
                                        finalizeInvoice();
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '5px' }}>
                            <ButtonType
                                text={texts.buttons.back}
                                typeButton="outlined"
                                onClick={goBack}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
