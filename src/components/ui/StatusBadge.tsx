import styles from './StatusBadge.module.css'

type StatusBadgeProps = {
  label: string
  variant?: 'sport' | 'status' | 'live'
}

export default function StatusBadge({ label, variant = 'status' }: StatusBadgeProps) {
  const className =
    variant === 'sport'
      ? styles.sportTag
      : variant === 'live'
        ? `${styles.statusBadge} ${styles.live}`
        : styles.statusBadge

  return (
    <span className={className} role={variant === 'live' ? 'status' : undefined}>
      {variant === 'live' && <span className={styles.liveDot} aria-hidden="true" />}
      {label}
    </span>
  )
}
