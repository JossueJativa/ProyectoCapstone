import { API } from './api';

interface DeskData {
    number: number;
    capacity: number;
}

interface AllergenData {
    name: string;
}

interface IngredientData {
    name: string;
    quantity: number;
    allergens: string[];
}

interface DishData {
    name: string;
    description: string;
    time_elaboration: number;
    price: number;
    link_ar: string;
    ingredients: string[];
}

const createDesk = async (data: DeskData): Promise<any> => {
    const { number, capacity } = data;
    const api = new API();
    const response = await api.post('/desk', {
        desk_number: number,
        capacity
    });
    return response?.data;
}

const createAllergen = async (data: AllergenData): Promise<any> => {
    const { name } = data;
    const api = new API();
    const response = await api.post('/allergens', {
        allergen_name: name
    });
    return response?.data;
}

const createIngredient = async (data: IngredientData): Promise<any> => {
    const { name, quantity, allergens } = data;
    const api = new API();
    const response = await api.post('/ingredient', {
        ingredient_name: name,
        quantity,
        allergen: allergens
    });
    return response?.data;
}

const createDish = async (data: DishData): Promise<any> => {
    const { 
        name,
        description,
        time_elaboration,
        price,
        link_ar,
        ingredients
    } = data;
    const api = new API();
    const response = await api.post('/dish', {
        dish_name: name,
        description,
        time_elaboration,
        price,
        link_ar,
        ingredient: ingredients
    });
    return response?.data;
}

export {
    createDesk,
    createAllergen,
    createIngredient,
    createDish
};
