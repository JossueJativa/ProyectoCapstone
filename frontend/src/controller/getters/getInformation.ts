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

const getGarrison = async(id: string) => {
    const api = new API();
    const response = await api.get(`/garrison/${id}`);
    return response?.data;
}

const getCategories = async() => {
    const api = new API();
    const response = await api.get('/category');
    return response?.data;
}

export { 
    getDesk, 
    getAllergens, 
    getIngredients,
    getIngredient,
    getGarrison,
    getCategories
};