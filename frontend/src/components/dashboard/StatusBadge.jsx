const statusStyles = {
    available: 'bg-surface-container text-on-tertiary-container',
    assigned: 'bg-secondary-fixed text-on-secondary-fixed',
    maintenance: 'bg-error-container text-on-error-container',
    retired: 'bg-surface-container-highest text-on-surface-variant',
};

function StatusBadge({ status }) {
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    const style = statusStyles[normalizedStatus] || 'bg-surface-container text-on-surface-variant';

    const label = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

    return (
        <span className={`inline-flex items-center gap-space-xs rounded-full px-space-sm py-space-xs text-label-sm font-label-md font-semibold ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

export default StatusBadge;