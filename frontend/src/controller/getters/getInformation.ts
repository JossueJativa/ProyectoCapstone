import { API } from '../api';

const getDesk = async() => {
    const api = new API();
    const response = await api.get('/desk');
    return response?.data;
}

const getAllergens = async() => {
    const api = new API();
    const response = await api.get('/allergens');
    return response?.data;
}

const getIngredients = async() => {
    const api = new API();
    const response = await api.get('/ingredient');
    return response?.data;
}

const getIngredient = async(ingredientId: string) => {
    const api = new API();
    const response = await api.get(`/ingredient/${ingredientId}`);
    return response?.data;
}

const getGarrisons = async() => {
    const api = new API();
    const response = await api.get('/garrison');
    return response?.data;
}

const getGarrison = async(id: string, lang: string = 'ES') => {
    const api = new API();
    const response = await api.get(`/garrison/${id}?lang=${lang.toUpperCase()}`);
    return response?.data;
}

const getCategories = async(lang: string = 'ES') => {
    const api = new API();
    const response = await api.get(`/category?lang=${lang.toUpperCase()}`);
    return response?.data;
};

const getOrders = async(month: number | null) => {
    const api = new API();
    if (month === null) {
        const response = await api.get('/order');
        return response?.data;
    }
    const response = await api.get(`/order?month=${month}`);
    return response?.data;
}

const getInvoices = async() => {
    const api = new API();
    const response = await api.get('/invoice');
    return response?.data;
}

const getInvoiceDetails = async(invoiceId: string) => {
    const api = new API();
    const response = await api.get(`/invoicedish`);
    if (response?.data) {
        const invoiceDetails = response.data.filter((detail: any) => detail.invoice === invoiceId);
        return invoiceDetails;
    }
    return response?.data;
}

const getDashboardInformation =  async(year: number, month: number) => {
    const api = new API();
    const response = await api.get(`/order/unified_statistics/?year=${year}&month=${month}`);
    return response?.data;
}

export { 
    getDesk, 
    getAllergens, 
    getIngredients,
    getIngredient,
    getGarrisons,
    getGarrison,
    getCategories,
    getOrders,
    getInvoices,
    getInvoiceDetails,
    getDashboardInformation
};