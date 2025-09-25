import { create } from "zustand";

type PlayerState = {
  id: string;
  name: string;
  setName: (newName: string) => void;
};

export const usePlayer = create<PlayerState>((set) => ({
  id: self.crypto.randomUUID(),
  name: "",
  setName: (newName: string) => set({ name: newName }),
}));
