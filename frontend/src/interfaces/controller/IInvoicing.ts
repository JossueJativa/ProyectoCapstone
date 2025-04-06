export interface IInvoicing {
    invoiceId: number;
    totalPrice: number;
    orderId: number;
}

export interface IInvoicingData {
    quantity: number;
    invoiceId: number;
    dishId: number;
}