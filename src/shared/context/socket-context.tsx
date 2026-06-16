"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";

interface RootState {
  auth?: {
    accessToken?: string | null;
  };
}

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  error: null,
});

export const useGlobalSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useSelector((state: RootState) => state.auth?.accessToken);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only connect if we have an access token
    if (!accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = ""; // Uses Next.js rewrites to proxy to NEXT_PUBLIC_API_URL
    
    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("connect_error", (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  return (
    // eslint-disable-next-line react-hooks/refs
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};
