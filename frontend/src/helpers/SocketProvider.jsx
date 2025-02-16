import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:3000", {
            transports: ["websocket"],
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
            console.log("✅ Conectado al servidor");
        });

        socketInstance.on("disconnect", () => {
            console.log("❌ Desconectado del servidor");
        });

        setSocket(socketInstance);

        return () => {
            console.log("🛑 Desmontando socket...");
            socketInstance.disconnect();
        };
    }, []);

    // Función para unirse a una mesa específica
    const joinDesk = (desk_id) => {
        if (socket) {
            socket.emit("join:desk", desk_id);
            console.log(`🪑 Joined desk_${desk_id}`);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, joinDesk }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
