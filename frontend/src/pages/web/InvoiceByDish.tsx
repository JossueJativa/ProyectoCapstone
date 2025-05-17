import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, useTheme, Checkbox } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useLanguage } from '@/helpers';
import { IconText, ButtonType, PopUpInformation } from '@/components';
import { IInvoicing, IInvoicingData } from '@/interfaces';
import { getOrderDishByOrderId, createInvoice, createInvoiceData } from '@/controller';

// Tipo local para facturas de UI
interface UIInvoice {
    person: number;
    dishes: any[];
    totalQuantity: number;
    total: number;
}

export const InvoiceByDish = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { texts } = useLanguage();
    const [deskId, setDeskId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [divisions, setDivisions] = useState<{ person: number; amount: string }[]>([]);
    const [selectedDishes, setSelectedDishes] = useState<any[]>([]);
    const [currentPerson, setCurrentPerson] = useState<number>(1);
    const [invoices, setInvoices] = useState<UIInvoice[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");
        setDeskId(desk_id);

        if (id) {
            const fetchData = async () => {
                const orderDishes = await getOrderDishByOrderId(id ? parseInt(id, 10) : 0);
                setOrder(orderDishes);
            };
            fetchData();
        }
    }, [id, location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const divide = parseInt(params.get("divide") || '0', 10);

        if (divide > 0 && order) {
            const totalPrice = order.reduce((acc: number, dish: any) => acc + (dish.quantity * dish.dish.price), 0);
            const amountPerPerson = totalPrice / divide;

            const divisions = Array.from({ length: divide }, (_, i) => ({
                person: i + 1,
                amount: amountPerPerson.toFixed(2),
            }));

            setDivisions(divisions);
        }
    }, [order, location.search]);

    const handleCheckboxChange = (dish: any, quantity: number) => {
        const existingDish = selectedDishes.find((d: any) => d.dish.id === dish.dish.id);
        if (existingDish) {
            if (quantity === 0) {
                setSelectedDishes(selectedDishes.filter((d: any) => d.dish.id !== dish.dish.id));
            } else {
                setSelectedDishes(selectedDishes.map((d: any) => d.dish.id === dish.dish.id ? { ...d, quantity } : d));
            }
        } else {
            setSelectedDishes([...selectedDishes, { ...dish, quantity }]);
        }
    };

    const finalizeInvoice = () => {
        if (selectedDishes.length === 0) {
            alert("Por favor, selecciona al menos un plato.");
            return;
        }

        const totalQuantity = selectedDishes.reduce((acc: number, dish: any) => acc + dish.quantity, 0);
        const total = selectedDishes.reduce((acc: number, dish: any) => acc + (dish.quantity * dish.dish.price), 0);
        setInvoices([...invoices, { person: currentPerson, dishes: selectedDishes, totalQuantity, total }]);

        // Adjust quantities of selected dishes in the order
        const updatedOrder = order.map((dish: any) => {
            const selectedDish = selectedDishes.find((d: any) => d.dish.id === dish.dish.id);
            if (selectedDish) {
                const remainingQuantity = dish.quantity - selectedDish.quantity;
                return remainingQuantity > 0 ? { ...dish, quantity: remainingQuantity } : null;
            }
            return dish;
        }).filter(Boolean);

        setOrder(updatedOrder);
        setSelectedDishes([]);
        setCurrentPerson(currentPerson + 1);
    };

    const goBack = () => {
        if (currentPerson > 1) {
            const previousInvoice = invoices[invoices.length - 1];
            setInvoices(invoices.slice(0, -1));
            setSelectedDishes(previousInvoice?.dishes || []);
            setCurrentPerson(currentPerson - 1);

            // Reset the order quantities to include the dishes from the previous invoice
            const updatedOrder = order.map((dish: any) => {
                const previousDish = previousInvoice?.dishes.find((d: any) => d.dish.id === dish.dish.id);
                if (previousDish) {
                    return { ...dish, quantity: (dish.quantity || 0) + (previousDish.quantity || 0) };
                }
                return dish;
            });

            setOrder(updatedOrder);
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
                    orderId: parseInt(id || '0', 10),
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

            setPopupOpen(true);
        } else {
            console.error("No hay facturas para procesar.");
        }
    };

    const calculateFinalTotal = (): { totalQuantity: number; totalPrice: number } => {
        const totalQuantity = invoices.reduce((acc: number, invoice: UIInvoice) => acc + invoice.totalQuantity, 0);
        const totalPrice = invoices.reduce((acc: number, invoice: UIInvoice) => acc + invoice.total, 0);
        return { totalQuantity, totalPrice };
    };

    const calculateTotal = (dishes: any[]): { totalQuantity: number; totalPrice: number } => {
        if (!dishes || dishes.length === 0) return { totalQuantity: 0, totalPrice: 0 };

        const totalQuantity = dishes.reduce((acc: number, dish: any) => acc + dish.quantity, 0);
        const totalPrice = dishes.reduce((acc: number, dish: any) => acc + (dish.quantity * dish.dish.price), 0);
        return { totalQuantity, totalPrice };
    };

    const { totalQuantity, totalPrice } = currentPerson > divisions.length ? calculateFinalTotal() : calculateTotal(selectedDishes);

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
                                borderRadius: theme.button.border.corners,
                            }}>
                                <Typography variant="h6" sx={{
                                    fontSize: theme.customTypography.body1.fontSize,
                                    fontWeight: theme.customTypography.body1.fontWeight,
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
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={!!selectedDishes.find((d: any) => d.dish.id === dish.dish.id)}
                                            onChange={(e) => handleCheckboxChange(dish, e.target.checked ? 1 : 0)}
                                        />
                                        <Typography>{dish.dish.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ marginRight: '10px' }}>Cantidad:</Typography>
                                        <input
                                            type="number"
                                            min="0"
                                            max={dish.quantity}
                                            value={selectedDishes.find((d: any) => d.dish.id === dish.dish.id)?.quantity || 0}
                                            onChange={(e) => handleCheckboxChange(dish, Math.min(parseInt(e.target.value, 10), dish.quantity))}
                                            style={{ width: '50px', textAlign: 'center' }}
                                        />
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
                                borderRadius: theme.button.border.corners,
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
                            <Box sx={{ marginTop: '20px' }}>
                                {invoices.map((invoice, index) => (
                                    <Box key={index}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: `1px solid white`,
                                            borderRadius: theme.button.border.corners,
                                            backgroundColor: theme.background.primary,
                                        }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            {texts.labels.invoice} {invoice.person}
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {texts.labels.totalAmount}:
                                            <span style={{
                                                color: theme.button.cafeMedio,
                                                fontSize: theme.customTypography.body1.fontSize,
                                                fontWeight: theme.customTypography.title.fontWeight,
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
                        borderRadius: theme.button.border.corners,
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
                                            finishInvoices()
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
