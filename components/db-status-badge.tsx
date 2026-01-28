interface DbStatusBadgeProps {
  status: 'loading' | 'ready' | 'error';
  error?: string;
}

export function DbStatusBadge({ status, error }: DbStatusBadgeProps) {
  const styles = {
    loading: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
  };

  const icons = {
    loading: '⏳',
    ready: '✓',
    error: '✕',
  };

  const labels = {
    loading: 'Initializing database...',
    ready: 'Database ready',
    error: error || 'Database error',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[status]}`}>
      {icons[status]} {labels[status]}
    </span>
  );
}
