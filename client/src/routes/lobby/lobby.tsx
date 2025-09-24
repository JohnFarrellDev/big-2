import { useState } from "react";
import styles from "./lobby.module.css";

export function Lobby() {
  const [username, setUsername] = useState("");

  function updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handleCreate() {
    const newRoom = crypto.randomUUID().slice(0, 6).toUpperCase();
    alert(`Created room: ${newRoom} for user: ${username}`);
    // TODO: navigate(`/room/${newRoom}`)
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
          value={username}
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
