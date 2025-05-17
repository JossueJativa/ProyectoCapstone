export interface IOrder {
    id: number;
    date: string;
    order_dish: Array<{
        dish_id: number;
    }>;
    total_price: number;
}