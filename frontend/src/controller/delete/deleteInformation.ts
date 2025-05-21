import { API } from '../api';

const deleteDesk = async (id: number): Promise<any> => {
    const api = new API();
    const response = await api.delete(`/desk/${id}`);
    return response?.data;
}

const deleteAllergen = async (id: number): Promise<any> => {
    const api = new API();
    const response = await api.delete(`/allergens/${id}`);
    return response?.data;
}

const deleteCategory = async (id: number): Promise<any> => {
    const api = new API();
    const response = await api.delete(`/category/${id}`);
    return response?.data;
}

const deleteIngredient = async (id: number): Promise<any> => {
    const api = new API();
    const response = await api.delete(`/ingredient/${id}`);
    return response?.data;
}

const deleteDish = async (id: number): Promise<any> => {
    const api = new API();
    const response = await api.delete(`/dish/${id}`);
    return response?.data;
}

const deleteGarrison = async (id: number): Promise<any> => {
    const api = new API();
    const response = await api.delete(`/garrison/${id}`);
    return response?.data;
}

export {
    deleteDesk,
    deleteAllergen,
    deleteCategory,
    deleteIngredient,
    deleteDish,
    deleteGarrison,
}