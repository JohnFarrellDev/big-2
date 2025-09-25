import { useEffect, useMemo } from "react";
import styles from "./ShareMenu.module.css";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  lobbyId: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ShareMenu({ lobbyId, isOpen, onClose }: Props) {
  const inviteUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/lobby/${lobbyId}`;
  }, [lobbyId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
    } catch {}
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Big Two lobby",
          text: "Hop in the room:",
          url: inviteUrl,
        });
      } catch {
        /* user canceled */
      }
    } else {
      copy();
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Share lobby"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Share Lobby</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Invite link</label>
          <div className={styles.row}>
            <input
              className={styles.input}
              value={inviteUrl}
              readOnly
              onFocus={(e) => e.currentTarget.select()}
            />
            <button className={styles.btn} onClick={copy}>
              Copy
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <button className={styles.btnPrimary} onClick={nativeShare}>
            Share…
          </button>
        </div>

        <div className={styles.qrWrap}>
          <QRCodeCanvas value={inviteUrl} size={180} marginSize={4} />
          <div className={styles.qrHint}>Scan to join</div>
        </div>
      </div>
    </div>
  );
}
