import { useState } from "react";
import { ShareMenu } from "./ShareMenu";
import styles from "./ShareButton.module.css";

export function ShareButton({ lobbyId }: { lobbyId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={styles.shareBtn} onClick={() => setOpen(true)}>
        Share
      </button>
      <ShareMenu
        lobbyId={lobbyId}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
