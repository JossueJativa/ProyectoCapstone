import { API } from '../api';
import { getIngredient } from './index';

const getDishes = async(lang: string = 'ES') => {
    const api = new API();
    const response = await api.get(`/dish?lang=${lang.toUpperCase()}`);
    return response?.data;
}

const getDish = async(dishId: string, lang: string = 'ES') => {
    const api = new API();
    const response = await api.get(`/dish/${dishId}?lang=${lang.toUpperCase()}`);
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

const getGarrisonsByDish = async(dishId: string) => {
    const api = new API();
    const response = await api.get(`/garrison`);

    const garrisonDish = response?.data.filter((garrison: any) => garrison.dish.includes(dishId));
    const garrisonReturn = garrisonDish.map((garrison: any) => {
        return {
            id: garrison.id,
            name: garrison.garrison_name
        };
    });
    return garrisonReturn;
}

const getOrderDishByOrderId = async(OrderID: number) => {
    const api = new API();
    const response = await api.get('/orderdish');
    const orderDishReturn = await Promise.all(response?.data
        .filter((orderD: any) => Number(orderD.order) === Number(OrderID))
        .map(async (orderD: any) => {
            const dishId = orderD.dish;
            const dish = await getDish(dishId);
            return {
                id: orderD.id,
                quantity: orderD.quantity,
                order: orderD.order,
                dish: {
                    id: dish.id,
                    name: dish.dish_name,
                    price: dish.price,
                }
            };
        })
    );
    return orderDishReturn;
};

export {
    getDishes, 
    getDish, 
    getAllergensByDish,
    getGarrisonsByDish,
    getOrderDishByOrderId
}