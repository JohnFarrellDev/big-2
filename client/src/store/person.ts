import { create } from "zustand";

type PlayerState = {
  id: string;
  name: string;
  setName: (newName: string) => void;
};

function getOrCreateId(): string {
  const stored = localStorage.getItem("playerId");
  if (stored) return stored;

  const id = self.crypto.randomUUID();
  localStorage.setItem("playerId", id);
  return id;
}

function getOrCreateName(): string {
  const stored = localStorage.getItem("playerName");
  if (stored) return stored;

  const name = `player-${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem("playerName", name);
  return name;
}

export const usePlayer = create<PlayerState>((set) => ({
  id: getOrCreateId(),
  name: getOrCreateName(),
  setName: (newName: string) => {
    localStorage.setItem("playerName", newName);
    set({ name: newName });
  },
}));
