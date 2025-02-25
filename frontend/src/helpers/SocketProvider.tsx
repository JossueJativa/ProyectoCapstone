import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    joinDesk: (desk_id: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);

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
    const joinDesk = (desk_id: string) => {
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

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
