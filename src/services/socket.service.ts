import { io, type Socket } from "socket.io-client";
const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";
let socket: Socket | null = null;
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};
export const connectSocket = (): Socket => {
  const currentSocket = getSocket();
  if (!currentSocket.connected) {
    currentSocket.connect();
  }
  return currentSocket;
};
export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
