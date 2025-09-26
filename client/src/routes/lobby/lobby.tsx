import { useParams } from "@tanstack/react-router";
import { useLobby } from "../../hooks/useLobby";
import styles from "./lobby.module.css";
import { usePlayer } from "../../store/person";
import { ShareButton } from "../../components/share-menu/ShareButton";
import { AdminIcon } from "../../components/icons/AdminIcon";
import { useState } from "react";

export default function Lobby() {
  const lobbyId = useParams({
    from: "/lobby/$lobbyId",
    select: (p) => p.lobbyId,
  });

  const { name: playerName, setName, id } = usePlayer();
  const { lobby, renameSelf } = useLobby(lobbyId, playerName);

  const [draftPlayerName, setDraftPlayerName] = useState(playerName);

  if (!lobby) return <div className={styles.loading}>Connecting…</div>;

  function handleEditName(event: React.ChangeEvent<HTMLInputElement>) {
    setDraftPlayerName(event.target.value);
  }

  function handleSubmitName() {
    setName(draftPlayerName);
    renameSelf(draftPlayerName);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{lobby.name}</h2>
      <ul className={styles.list}>
        {lobby.players.map((player) => (
          <li key={player.id} className={styles.player}>
            <div className={styles.playerName}>
              <input
                type="text"
                value={player.id === id ? draftPlayerName : player.name}
                onChange={handleEditName}
                className={styles.playerNameInput}
                readOnly={player.id !== id}
                onBlur={handleSubmitName}
                maxLength={20}
              />
            </div>
            <div className={styles.iconContainer}>
              {player.isAdmin && (
                <span>
                  <AdminIcon />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div>
        <ShareButton lobbyId={lobby.id} />
      </div>
    </div>
  );
}
