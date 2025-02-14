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

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
