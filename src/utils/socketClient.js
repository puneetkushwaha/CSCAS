import { io } from 'socket.io-client';

/**
 * Creates and returns a centralized Socket.io instance.
 * Using this utility ensures consistent connection logic (e.g., relative URL for proxy support)
 * across all frontend components like AdminDashboard and ExamPlayer.
 */
export const createSocket = () => {
    return io();
};
