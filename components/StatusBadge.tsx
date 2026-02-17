const statusConfig = {
  reading: { label: 'Reading', className: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
  want_to_read: { label: 'Want to Read', className: 'bg-amber-100 text-amber-800' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.want_to_read
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${config.className}`}>
      {config.label}
    </span>
  )
}
