import { useEffect, useState } from "react";
import { getSocket } from "../utils/socket";
import { usePlayer } from "../store/person";

export type Lobby = {
  id: string;
  name: string;
  players: { id: string; name: string; isAdmin: boolean }[];
};

export function useLobby(lobbyId: string, playerName: string) {
  const [lobby, setLobby] = useState<Lobby | null>(null);

  const s = getSocket();
  const { id: playerId } = usePlayer();

  useEffect(() => {
    function onState(state: Lobby) {
      if (state.id === lobbyId) setLobby(state);
    }

    function join() {
      s.emit("lobby:join", { lobbyId, playerName });
    }

    s.on("lobby:state", onState);
    s.on("connect", join); // rejoin after reconnect
    join(); // initial join

    return () => {
      s.emit("lobby:leave", lobbyId);
      s.off("lobby:state", onState);
      s.off("connect", join);
    };
  }, [lobbyId]);

  function renameSelf(newName: string) {
    if (!lobby) return;

    s.emit("player:updateName", {
      lobbyId: lobby?.id,
      playerId: playerId,
      name: newName,
    });
  }

  return { lobby, renameSelf };
}
