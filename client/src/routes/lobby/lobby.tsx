import { useState } from "react";
import styles from "./lobby.module.css";

export function Lobby() {
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = () => {
    const newRoom = crypto.randomUUID().slice(0, 6).toUpperCase();
    alert(`Created room: ${newRoom}`);
    // TODO: navigate(`/room/${newRoom}`)
  };

  const handleJoin = () => {
    if (!roomCode) return;
    alert(`Joining room: ${roomCode}`);
    // TODO: navigate(`/room/${roomCode}`)
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />

      <div className={styles.card}>
        <h1 className={styles.title}>♠ Big Two ♦</h1>
        <p className={styles.subtitle}>Play with your friends in real-time</p>

        <div className={styles.actions}>
          <button className={styles.createBtn} onClick={handleCreate}>
            Create a Room
          </button>
        </div>

        <div className={styles.actions}>
          <input
            className={styles.input}
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button className={styles.joinBtn} onClick={handleJoin}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
