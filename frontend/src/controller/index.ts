export { 
    LoginAuth,
    GetUserAuth,
    LogoutAuth
} from './auth';
export {
    getDishes,
    getDish,
    getAllergensByDish,
    getGarrisonsByDish,
    getOrderDishByOrderId,
    getDesk,
    getAllergens,
    getIngredients,
    getIngredient,
    getGarrison,
    getCategories,
    getOrders,
    getInvoices
} from './getters';
export {
    createDesk,
    createAllergen,
    createIngredient,
    createDish,
    createOrder,
    createOrderDish,
    createInvoice,
    createInvoiceData,
    createCategory,
    createGarrison
} from './setters';