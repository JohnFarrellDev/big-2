import { randomUUID } from "node:crypto";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export type Lobby = {
  id: string;
  name: string;
  createdAt: number;
  players: User[];
};

const lobbies = new Map<string, Lobby>();

const MAX_PLAYERS = 20;

export function createLobby(): Lobby {
  const id = randomUUID().toUpperCase();
  const lobby: Lobby = {
    id,
    createdAt: Date.now(),
    players: [],
    name: `name-${Math.random() * 1000}`,
  };
  lobbies.set(id, lobby);
  return lobby;
}

export function getLobby(id: string): Lobby | null {
  return lobbies.get(id.toUpperCase()) ?? null;
}

export function joinLobby(id: string, playerId: string, name: string): Lobby {
  const lobby = getLobby(id) ?? createLobbyWithId(id);
  const existing = lobby.players.find((p) => p.id === playerId);
  if (existing) {
    existing.name = name;
    return lobby;
  }
  if (lobby.players.length >= MAX_PLAYERS) throw new Error("lobby_full");
  lobby.players.push({
    id: playerId,
    name,
    isAdmin: lobby.players.length === 0,
  });
  return lobby;
}

export function leaveLobby(id: string, playerId: string): Lobby | null {
  const lobby = getLobby(id);
  if (!lobby) return null;
  lobby.players = lobby.players.filter((p) => p.id !== playerId);
  if (lobby.players.length === 0) lobbies.delete(lobby.id);

  return lobby;
}

function createLobbyWithId(id: string): Lobby {
  const lobbyId = id.toUpperCase();
  const lobby: Lobby = {
    id: lobbyId,
    createdAt: Date.now(),
    players: [],
    name: `name-${Math.random() * 1000}`,
  };
  lobbies.set(lobbyId, lobby);
  return lobby;
}
