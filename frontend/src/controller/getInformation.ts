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

const getIngredient = async(ingredientId: string) => {
    const api = new API();
    const response = await api.get(`/ingredient/${ingredientId}`);
    return response?.data;
}

const getDishes = async() => {
    const api = new API();
    const response = await api.get('/dish');
    return response?.data;
}

const getDish = async(dishId: string) => {
    const api = new API();
    const response = await api.get(`/dish/${dishId}`);
    return response?.data;
}

const getAllergensByDish = async(dishId: string) => {
    const api = new API();
    const response = await api.get(`/dish/${dishId}`);
    const dish = response?.data;

    const ingredientIds = dish.ingredient || [];
    const allergensSet = new Set<number>();

    for (const ingredientId of ingredientIds) {
        try {
            const allergen = await getIngredient(ingredientId);
            if (allergen && Array.isArray(allergen.allergen)) {
                allergen.allergen.forEach((a: number) => allergensSet.add(a));
            } else if (allergen && allergen.allergen) {
                allergensSet.add(allergen.allergen);
            }
        } catch (error) {
            console.error("Error fetching allergen for ingredient ID:", ingredientId, error);
        }
    }
    return Array.from(allergensSet).sort((a, b) => a - b);
};

export { 
    getDesk, 
    getAllergens, 
    getAllergensByDish,
    getIngredients,
    getDishes,
    getDish,
    getIngredient,
};