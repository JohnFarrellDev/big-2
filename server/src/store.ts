import { randomUUID } from "node:crypto";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export type Lobby = {
  id: string;
  createdAt: number;
  seats: User[];
};

const lobbies = new Map<string, Lobby>();

const MAX_SEATS = 20;

export function createLobby(): Lobby {
  const id = randomUUID().toUpperCase();
  const lobby: Lobby = { id, createdAt: Date.now(), seats: [] };
  lobbies.set(id, lobby);
  return lobby;
}

export function getLobby(id: string): Lobby | null {
  return lobbies.get(id.toUpperCase()) ?? null;
}

export function joinLobby(id: string, playerId: string, name: string): Lobby {
  const lobby = getLobby(id) ?? createLobbyWithId(id);
  const existing = lobby.seats.find((s) => s.id === playerId);
  if (existing) {
    existing.name = name;
    return lobby;
  }
  if (lobby.seats.length >= MAX_SEATS) throw new Error("lobby_full");
  lobby.seats.push({ id: playerId, name, isAdmin: lobby.seats.length === 0 });
  return lobby;
}

export function leaveLobby(id: string, playerId: string) {
  const lobby = getLobby(id);
  if (!lobby) return;
  lobby.seats = lobby.seats.filter((s) => s.id !== playerId);
  if (lobby.seats.length === 0) lobbies.delete(lobby.id);
}

function createLobbyWithId(id: string): Lobby {
  const lobbyId = id.toUpperCase();
  const lobby: Lobby = { id: lobbyId, createdAt: Date.now(), seats: [] };
  lobbies.set(lobbyId, lobby);
  return lobby;
}
