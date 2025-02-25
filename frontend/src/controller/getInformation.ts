import { API } from './api';

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

const getDishes = async() => {
    const api = new API();
    const response = await api.get('/dish');
    return response?.data;
}

export { 
    getDesk, 
    getAllergens, 
    getIngredients,
    getDishes
};