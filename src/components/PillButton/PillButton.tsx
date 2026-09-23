import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./PillButton.module.css";

type PillButtonProps = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  children: string;
  tone?: "muted" | "dark";
};

/** Rounded pill link from the Figma file, with a text-roll on hover. */
export default function PillButton({ children, tone = "muted", className, href = "", ...props }: PillButtonProps) {
  const classes = [styles.button, styles[tone], className].filter(Boolean).join(" ");
  const label = (
    <span className={styles.roll}>
      <span data-text={children}>{children}</span>
    </span>
  );

  // Internal routes navigate client-side so the intro doesn't replay.
  return href.startsWith("/") ? (
    <Link href={href} className={classes} {...props}>
      {label}
    </Link>
  ) : (
    <a href={href} className={classes} {...props}>
      {label}
    </a>
  );
}
