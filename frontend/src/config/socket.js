// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        // Check if userInfo exists before trying to connect
        if (userInfo) {
            // Connect to the server
            const socketIo = io('http://localhost:5000', { // Update with your server URL
                query: { userId: userInfo._id } // Pass actual user ID
            });

            setSocket(socketIo);

            // Cleanup on unmount
            return () => {
                socketIo.disconnect();
            };
        }
    }, [userInfo]); // Make sure to add 'userInfo' as a dependency


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
