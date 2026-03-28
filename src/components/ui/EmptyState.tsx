import styles from './EmptyState.module.css'

type EmptyStateProps = {
  message?: string
  suggestion?: string
}

export default function EmptyState({
  message = 'No results found.',
  suggestion = 'Try adjusting your filters or search terms.',
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState} role="status">
      <div className={styles.emptyIcon} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.35" />
          <path d="M20 20L28 28M28 20L20 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className={styles.emptyMessage}>{message}</p>
      <p className={styles.emptySuggestion}>{suggestion}</p>
    </div>
  )
}
