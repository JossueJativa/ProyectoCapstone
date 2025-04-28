import { API } from '../api';
import {
    IDeskData,
    IAllergenData,
    IIngredientData,
    IDishData,
} from '@/interfaces';

const updateDesk = async (data: IDeskData): Promise<any> => {
    const { id, number, capacity } = data;
    const api = new API();
    const response = await api.put(`/desk/${id}`, {
        desk_number: number,
        capacity
    });
    return response?.data;
}

const updateAllergen = async (data: IAllergenData): Promise<any> => {
    const { id, name } = data;
    const api = new API();
    const response = await api.put(`/allergens/${id}`, {
        allergen_name: name,
    });
    return response?.data;
}

const updateCategory = async (data: any): Promise<any> => {
    const { id, name } = data;
    const api = new API();
    const response = await api.put(`/category/${id}`, {
        category_name: name,
    });
    return response?.data;
}

const updateIngredient = async (data: IIngredientData): Promise<any> => {
    const { id, name, quantity, allergens } = data;
    const api = new API();
    const response = await api.put(`/ingredient/${id}`, {
        ingredient_name: name,
        quantity,
        allergen: allergens
    });
    return response?.data;
}

const updateDish = async (data: IDishData): Promise<any> => {
    const { 
        id, 
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
    const response = await api.put(`/dish/${id}`, {
        dish_name,
        description,
        time_elaboration,
        price,
        link_ar,
        ingredient: ingredients,
        category,
        has_garrison,
    });
    console.log(response?.data);
    return response?.data;
}

export {
    updateDesk,
    updateAllergen,
    updateCategory,
    updateIngredient,
    updateDish
}