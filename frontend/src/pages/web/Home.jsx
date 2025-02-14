import { useEffect } from 'react';
import { useSocket } from '../../helpers';

export const Home = () => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;
    }, [socket]);

    return (
        <>
            <h1>Home</h1>
        </>
    )
}
