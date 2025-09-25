import styles from "./home.module.css";
import { usePlayer } from "../../store/person";
import { createNewLobby } from "../../api/createNewLobby";

export function Home() {
  const player = usePlayer();

  function updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    player.setName(e.target.value);
  }

  async function handleCreate() {
    // make a request to the server to create a lobby for our user
    // take the response and navigate to the lobby page using the lobby id

    const res = await createNewLobby({
      playerId: player.id,
      name: player.name,
    });

    window.location.href = `/lobby/${res?.lobbyId}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />

      <div className={styles.card}>
        <h1 className={styles.title}>♠ Big Two ♦</h1>
        <p className={styles.subtitle}>Set your name</p>
        <input
          type="text"
          onChange={updateUsername}
          value={player.name}
          className={styles.usernameInput}
        />
        <div className={styles.actions}>
          <button className={styles.createBtn} onClick={handleCreate}>
            Create a Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
