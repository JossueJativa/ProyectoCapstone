import { API } from '../api';
import {
    IDeskData,
    IAllergenData,
    IIngredientData,
    IDishData,
} from '@/interfaces';

// Extiende los tipos para update, permitiendo id y otros campos extra

type UpdateDeskData = IDeskData & { id: number };
type UpdateAllergenData = IAllergenData & { id: number };
type UpdateIngredientData = IIngredientData & { id: number };
type UpdateDishData = IDishData & { id: number; dish_name: string };

const updateDesk = async (data: UpdateDeskData): Promise<any> => {
    const { id, number, capacity } = data;
    const api = new API();
    const response = await api.put(`/desk/${id}`, {
        desk_number: number,
        capacity
    });
    return response?.data;
}

const updateAllergen = async (data: UpdateAllergenData): Promise<any> => {
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

const updateIngredient = async (data: UpdateIngredientData): Promise<any> => {
    const { id, name, quantity, allergens } = data;
    const api = new API();
    const response = await api.put(`/ingredient/${id}`, {
        ingredient_name: name,
        quantity,
        allergen: allergens
    });
    return response?.data;
}

const updateDish = async (data: UpdateDishData): Promise<any> => {
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
    return response?.data;
}

const updateGarrison = async(data: any): Promise<any> => {
    const { id, garrison_name, dish } = data;
    const api = new API();

    const response = await api.put(`/garrison/${id}`, {
        garrison_name,
        dish
    });
    return response?.data;
}

export {
    updateDesk,
    updateAllergen,
    updateCategory,
    updateIngredient,
    updateDish,
    updateGarrison
}