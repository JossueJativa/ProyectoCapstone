import { Grid, Box, useTheme, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { SideBar } from '@/components';
import { getInvoices, getInvoiceDetails, getDish } from '@/controller';

export const CreateInvoices = () => {
    const theme = useTheme();
    const [invoices, setInvoices] = useState<any>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [searchDesk, setSearchDesk] = useState<string>('');

    useEffect(() => {
        const fetchInvoices = async () => {
            const response = await getInvoices();
            if (response) {
                setInvoices(response);
            } else {
                console.error('Error fetching invoices');
            }
        };
        fetchInvoices();
    }, []);

    const handleInvoiceClick = async (invoiceId: string) => {
        console.log('Fetching details for invoice ID:', invoiceId); // Log the invoice ID being fetched
        const details = await getInvoiceDetails(invoiceId);
        console.log('Fetched invoice details:', details); // Log the fetched invoice details

        const detailedDishes = await Promise.all(details.map(async (invoiceDish: any) => {
            const dish = await getDish(invoiceDish.dish);
            console.log('Fetched dish details:', dish); // Log the fetched dish details
            const subtotal = dish.price * invoiceDish.quantity;
            return {
                id: invoiceDish.id,
                quantity: invoiceDish.quantity,
                dishName: dish.dish_name,
                price: dish.price,
                subtotal,
            };
        }));

        const invoice = invoices.find((inv: any) => inv.id === invoiceId);

        setSelectedInvoice({
            id: invoiceId,
            order: invoice ? invoice.order : 'N/A',
            dishes: detailedDishes,
            totalPrice: invoice ? invoice.total_price : 0,
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: theme.background.primary, minHeight: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ width: 'auto' }}>
                <Grid container width={'20%'}>
                    <SideBar />
                </Grid>

                <Grid item xs={12} md={9} sx={{ padding: '20px', display: 'flex' }}>
                    {/* Parte izquierda: Mostrar detalles de la factura seleccionada */}
                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {selectedInvoice ? (
                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <p><strong>Factura Número:</strong> {selectedInvoice.id}</p>
                                <p><strong>Orden:</strong> {selectedInvoice.order || 'N/A'}</p>
                                <p><strong>Total:</strong> ${selectedInvoice.totalPrice.toFixed(2)}</p>
                                <h4>Platos:</h4>
                                <ul>
                                    {selectedInvoice.dishes.map((dish: any, index: number) => (
                                        <li key={index} style={{ listStyleType: 'none', marginBottom: '5px' }}>
                                            {dish.dishName} - ${dish.price.toFixed(2)} x {dish.quantity} = ${dish.subtotal.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        ) : (
                            <p>Seleccione una factura para ver los detalles.</p>
                        )}
                    </Box>

                    {/* Parte derecha: Mostrar lista de facturas */}
                    <Box
                        sx={{
                            width: '50%',
                            padding: '10px',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <TextField
                            label="Buscar por ID"
                            variant="outlined"
                            value={searchDesk}
                            onChange={(e) => setSearchDesk(e.target.value)}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        {invoices.filter((invoice: any) => invoice.id.toString().includes(searchDesk)).slice().reverse().map((invoice: any, index: number) => (
                            <Box
                                key={index}
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleInvoiceClick(invoice.id)}
                            >
                                <p><strong>ID:</strong> {invoice.id}</p>
                                <p><strong>Factura Número:</strong> {invoice.invoice_number}</p>
                                <p><strong>Orden:</strong> {invoice.order}</p>
                                <p><strong>Total:</strong> ${invoice.total_price.toFixed(2)}</p>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
