import { randomUUID } from "node:crypto";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export type Room = {
  id: string;
  createdAt: number;
  seats: User[];
};

const rooms = new Map<string, Room>();

const MAX_SEATS = 20;

export function createRoom(): Room {
  const id = randomUUID().toUpperCase();
  const room: Room = { id, createdAt: Date.now(), seats: [] };
  rooms.set(id, room);
  return room;
}

export function getRoom(id: string): Room | null {
  return rooms.get(id.toUpperCase()) ?? null;
}

export function joinRoom(id: string, playerId: string, name: string): Room {
  const room = getRoom(id) ?? createRoomWithId(id);
  const existing = room.seats.find((s) => s.id === playerId);
  if (existing) {
    existing.name = name;
    return room;
  }
  if (room.seats.length >= MAX_SEATS) throw new Error("room_full");
  room.seats.push({ id: playerId, name, isAdmin: room.seats.length === 0 });
  return room;
}

export function leaveRoom(id: string, playerId: string) {
  const room = getRoom(id);
  if (!room) return;
  room.seats = room.seats.filter((s) => s.id !== playerId);
  if (room.seats.length === 0) rooms.delete(room.id);
}

function createRoomWithId(id: string): Room {
  const roomId = id.toUpperCase();
  const room: Room = { id: roomId, createdAt: Date.now(), seats: [] };
  rooms.set(roomId, room);
  return room;
}
