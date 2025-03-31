export interface IOrderData {
    deskId: number;
    totalPrice: number;
    status: string;
    orderDish: {
        dishId: number;
        quantity: number;
    }[];
}