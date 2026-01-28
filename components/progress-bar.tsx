'use client';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export function ProgressBar({ completed, total, label }: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      {(label || total > 0) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-zinc-300">{label}</span>}
          {total > 0 && (
            <span className="text-sm text-zinc-400">
              {completed}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden border border-zinc-700">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
