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

export const usePlayer = create<PlayerState>((set) => ({
  id: getOrCreateId(),
  name: localStorage.getItem("playerName") || "",
  setName: (newName: string) => {
    localStorage.setItem("playerName", newName);
    set({ name: newName });
  },
}));
