import { useParams } from "@tanstack/react-router";
import { useLobby } from "../../hooks/useLobby";
import styles from "./lobby.module.css";
import { usePlayer } from "../../store/person";
import { ShareButton } from "../../components/share-menu/ShareButton";

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
      <h2 className={styles.title}>{lobby.name}</h2>
      <ul className={styles.list}>
        {lobby.players.map((p) => (
          <li key={p.id} className={styles.player}>
            {p.name}
          </li>
        ))}
      </ul>
      <div>
        <ShareButton lobbyId={lobby.id} />
      </div>
    </div>
  );
}
