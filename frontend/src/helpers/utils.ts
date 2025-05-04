export const calculateTotal = (order: any[]) => {
    if (!order) return { totalQuantity: 0, totalPrice: 0 };

    const totalQuantity = order.reduce((acc, dish) => acc + dish.quantity, 0);
    const subtotal = order.reduce((acc, dish) => acc + (dish.dish.price * dish.quantity), 0);
    const tax = subtotal * 0.15;
    const totalPrice = subtotal + tax;

    return { totalQuantity, totalPrice };
};