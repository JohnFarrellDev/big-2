import styles from "./home.module.css";
import { usePlayer } from "../../store/person";
import { createNewRoom } from "../../api/createNewRoom";

export function Home() {
  const player = usePlayer();

  function updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    player.setName(e.target.value);
  }

  async function handleCreate() {
    // make a request to the server to create a room for our user
    // take the response and navigate to the room page using the room id

    const res = await createNewRoom({ playerId: player.id, name: player.name });
    console.log("🚀 ~ handleCreate ~ res:", res);
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
            Create a Room
          </button>
        </div>
      </div>
    </div>
  );
}
