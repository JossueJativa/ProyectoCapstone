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

const getOrders = async() => {
    const api = new API();
    const response = await api.get('/order');
    return response?.data;
}

export { 
    getDesk, 
    getAllergens, 
    getIngredients,
    getIngredient,
    getGarrison,
    getCategories,
    getOrders
};