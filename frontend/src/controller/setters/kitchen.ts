import { API } from '../api';
import {
    IDeskData,
    IAllergenData,
    IIngredientData,
    IDishData,
    IOrderData
} from '@/interfaces'

const createDesk = async (data: IDeskData): Promise<any> => {
    const { number, capacity } = data;
    const api = new API();
    const response = await api.post('/desk', {
        desk_number: number,
        capacity
    });
    return response?.data;
}

const createAllergen = async (data: IAllergenData): Promise<any> => {
    const { name } = data;
    const api = new API();
    const response = await api.post('/allergens', {
        allergen_name: name
    });
    return response?.data;
}

const createCategory = async (data: any): Promise<any> => {
    const { category_name } = data;
    const api = new API();
    const response = await api.post('/category', {
        category_name
    });
    return response?.data;
}

const createIngredient = async (data: IIngredientData): Promise<any> => {
    const { name, allergens } = data;
    const api = new API();
    const response = await api.post('/ingredient', {
        ingredient_name: name,
        allergen: allergens
    });
    return response?.data;
}

const createGarrison = async (data: any): Promise<any> => {
    const { garrison_name, dish } = data;
    const api = new API();
    const response = await api.post('/garrison', {
        garrison_name,
        dish
    });
    return response?.data;
}

const createDish = async (data: IDishData): Promise<any> => {
    const { 
        dish_name,
        description,
        time_elaboration,
        price,
        link_ar,
        ingredients,
        category,
        has_garrison,
    } = data;
    const api = new API();
    const response = await api.post('/dish', {
        dish_name,
        description,
        time_elaboration,
        price,
        link_ar,
        ingredient: ingredients,
        category,
        has_garrison,
    });
    return response?.data;
}

const createOrder = async (data: IOrderData): Promise<any> => {
    const { deskId, totalPrice, status } = data;
    const api = new API();
    // date YYYY-MM-DD
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    // Time HH:MM:SS
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Validar que el desk existe antes de crear el order
    const deskResponse = await api.get(`/desk/by-number/${deskId}`);
    if (!deskResponse || deskResponse.status !== 200) {
        alert(`No existe una mesa (desk) con id ${deskId}. Por favor selecciona una válida.`);
        return null;
    }
    const desk_id = deskResponse.data.id;

    const response = await api.post('/order', {
        date: formattedDate,
        time: formattedTime,
        total_price: totalPrice,
        desk: desk_id,
        status,
    });

    return response?.data;
}

const createOrderDish = async (data: any): Promise<any> => {
    const { dishId, quantity, order } = data;
    const api = new API();
    const response = await api.post('/orderdish', {
        dish: dishId,
        quantity,
        order
    });
    return response?.data;
}

export {
    createDesk,
    createAllergen,
    createIngredient,
    createDish,
    createOrder,
    createOrderDish,
    createCategory,
    createGarrison
};
