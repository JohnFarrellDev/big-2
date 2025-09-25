import { useParams } from "@tanstack/react-router";
import { useLobby } from "../../hooks/useLobby";
import styles from "./lobby.module.css";
import { usePlayer } from "../../store/person";

export default function Lobby() {
  const lobbyId = useParams({
    from: "/lobby/$lobbyId",
    select: (p) => p.lobbyId,
  });

  const { name } = usePlayer();
  const lobby = useLobby(lobbyId, name);

  if (!lobby) return <div className={styles.loading}>Connecting…</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Room {lobby.id}</h2>
      <ul className={styles.list}>
        {lobby.players.map((p) => (
          <li key={p.id} className={styles.player}>
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
