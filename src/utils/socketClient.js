import { io } from 'socket.io-client';

// In dev: Vite proxy handles /socket.io → localhost:5000
// In production: VITE_SOCKET_URL must point to the Render backend URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export const createSocket = () =>
    io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
    });
