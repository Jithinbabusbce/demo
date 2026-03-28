import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './InfoCard.module.css'

type MetaItem = {
  label: string
  className?: string
}

type InfoCardProps = {
  title: string
  badge?: { label: string; className?: string }
  meta?: MetaItem[]
  description?: string
  action?: { label: string; to?: string }
  children?: ReactNode
}

export default function InfoCard({ title, badge, meta, description, action, children }: InfoCardProps) {
  return (
    <article className={styles.infoCard}>
      <div className={styles.infoCardHead}>
        <h3>{title}</h3>
        {badge ? <span className={badge.className ?? styles.sportTag}>{badge.label}</span> : null}
      </div>
      {meta && meta.length > 0 ? (
        <div className={styles.infoCardMeta}>
          {meta.map((m) => (
            <span key={m.label} className={m.className}>{m.label}</span>
          ))}
        </div>
      ) : null}
      {description ? <p>{description}</p> : null}
      {children}
      {action ? (
        action.to ? (
          <Link className={styles.cardActionBtn} to={action.to}>{action.label}</Link>
        ) : (
          <button className={styles.cardActionBtn}>{action.label}</button>
        )
      ) : null}
    </article>
  )
}
