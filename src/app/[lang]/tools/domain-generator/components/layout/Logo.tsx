import Link from "next/link";
import Image from "next/image";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href="/" className={styles.logoLink} aria-label="Domifai">
      <Image
        src="/images/logo.png"
        alt="Domifai"
        width={32}
        height={32}
        priority
        className={styles.logoImage}
      />
      <span className={styles.logoText}>Domifai</span>
    </Link>
  );
}
