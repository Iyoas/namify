"use client";

import { useState } from "react";
import { CalendarDays, Clock3, FileText, Share2 } from "lucide-react";
import styles from "./BlogPost.module.css";

type BlogMetaRowProps = {
  dateLabel: string;
  readingTimeLabel: string;
  wordCountLabel: string;
  shareLabel: string;
  shareUrl: string;
  copiedLabel: string;
};

export default function BlogMetaRow({
  dateLabel,
  readingTimeLabel,
  wordCountLabel,
  shareLabel,
  shareUrl,
  copiedLabel,
}: BlogMetaRowProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleShare() {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ url: shareUrl });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        window.setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("[blog] share failed", error);
    }
  }

  return (
    <div className={styles.metaRow}>
      <span className={styles.metaItem}>
        <CalendarDays className={styles.metaIcon} aria-hidden="true" />
        <span>{dateLabel}</span>
      </span>
      <span className={styles.metaItem}>
        <Clock3 className={styles.metaIcon} aria-hidden="true" />
        <span>{readingTimeLabel}</span>
      </span>
      <span className={styles.metaItem}>
        <FileText className={styles.metaIcon} aria-hidden="true" />
        <span>{wordCountLabel}</span>
      </span>
      <button type="button" className={styles.shareButton} onClick={handleShare}>
        <Share2 className={styles.metaIcon} aria-hidden="true" />
        <span>{isCopied ? copiedLabel : shareLabel}</span>
      </button>
    </div>
  );
}
