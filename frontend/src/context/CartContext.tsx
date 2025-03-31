import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "@/helpers";
import { ICartContextProps } from "@/interfaces";

const CartContext = createContext<ICartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { socket } = useSocket();

    const syncCart = () => {
        const params = new URLSearchParams(window.location.search);
        const desk_id = params.get("desk_id");

        if (socket && desk_id) {
            socket.emit("order:get", { desk_id }, (error: any, orderDetails: any[]) => {
                if (error) {
                    console.error("Error fetching cart details:", error);
                    return;
                }
                setCartCount(orderDetails.length);
            });
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const desk_id = params.get("desk_id");

        if (socket && desk_id) {
            // Sync cart on initial load
            syncCart();

            // Listen for real-time updates
            const handleCartUpdate = (orderDetails: any[]) => {
                const activeOrders = orderDetails.filter(order => order.update_type !== "delete"); // Exclude deleted items
                setCartCount(activeOrders.length);
            };

            socket.on(`order:details`, handleCartUpdate);

            return () => {
                socket.off(`order:details`, handleCartUpdate);
            };
        }
    }, [socket, window.location.search]);

    return (
        <CartContext.Provider value={{ cartCount, syncCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
