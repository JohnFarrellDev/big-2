import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const uid = localStorage.getItem("playerId")!;
    socket = io("http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
      auth: { uid },
    });
  }
  return socket;
}
