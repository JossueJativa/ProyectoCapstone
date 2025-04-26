export interface IOrder {
    date: string;
    order_dish: Array<{
        dish_id: number;
    }>;
    total_price: number;
}