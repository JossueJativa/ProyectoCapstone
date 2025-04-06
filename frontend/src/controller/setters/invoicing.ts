import { API } from '../api';
import { IInvoicing, IInvoicingData } from '@/interfaces';

const createInvoice = async (data: IInvoicing): Promise<any> => {
    const { invoiceId, totalPrice, orderId } = data; // Asegurarse de usar 'orderId'
    const api = new API();

    const response = await api.post('/invoice', {
        invoice_number: invoiceId,
        total_price: totalPrice,
        order: orderId,
    });

    return response?.data;
}

const createInvoiceData = async (data: IInvoicingData): Promise<any> => {
    const api = new API();
    const formattedData = {
        quantity: data.quantity,
        invoice: data.invoiceId,
        dish: data.dishId,
    };
    const response = await api.post('/invoicedish', formattedData);
    return response?.data;
}

export {
    createInvoice,
    createInvoiceData
}