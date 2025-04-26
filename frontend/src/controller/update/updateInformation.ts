import { API } from '../api';
import {
    IDeskData,
    IAllergenData,
    IIngredientData,
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

const updateIngredient = async(data: IIngredientData): Promise<any> => {
    const { id, name, quantity, allergens } = data;
    const api = new API();
    const response = await api.put(`/ingredient/${id}`, {
        ingredient_name: name,
        quantity,
        allergen: allergens
    });
    return response?.data;
}

export {
    updateDesk, 
    updateAllergen,
    updateCategory,
    updateIngredient
}