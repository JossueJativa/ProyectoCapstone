import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

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
    const location = useLocation();

    useEffect(() => {
        const socketInstance = io("https://bistroalpasoar.com/ws", {
            path: "/ws/socket.io",
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const desk_id = params.get("desk_id");

        if (desk_id && socket) {
            joinDesk(desk_id);
        }
    }, [location.search, socket]);

    // Función para unirse a una mesa específica
    const joinDesk = async (desk_id: string) => {
        if (socket) {
            return new Promise<void>((resolve, reject) => {
                socket.emit("join:desk", desk_id, (response: any) => {
                    if (response.success) {
                        console.log(`🪑 Joined desk_${desk_id}`);
                        resolve();
                    } else {
                        reject(new Error(response.message));
                    }
                });
            });
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
