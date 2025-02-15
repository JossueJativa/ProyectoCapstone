import { API } from './api';

const createDesk = async(data) => {
    const { number, capacity } = data;
    const api = new API();
    const response = await api.post('/desk', {
        desk_number: number,
        capacity
    });
    return response.data;
}

const createAllergen = async(data) => {
    const { name } = data;
    const api = new API();
    const response = await api.post('/allergens', {
        allergen_name: name
    });
    return response.data;
}

const createIngredient = async(data) => {
    const { name, quantity, allergens } = data;
    const api = new API();
    const response = await api.post('/ingredient', {
        ingredient_name: name,
        quantity,
        allergen: allergens
    });
    return response.data;
}

const createDish = async(data) => {
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
    return response.data;
}

export {
    createDesk,
    createAllergen,
    createIngredient,
    createDish
};
