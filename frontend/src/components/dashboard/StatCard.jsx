function StatCard({
    label,
    value,
    icon: Icon,
    tone = 'default',
    detail,
}) {
    const valueStyles = {
        default: 'text-on-surface',
        success: 'text-on-tertiary-container',
        primary: 'text-secondary',
        danger: 'text-error',
    };

    return (
        <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
            <div className="flex items-start justify-between gap-space-md">
                <div>
                    <p className="text-label-sm font-label-md uppercase tracking-wider text-on-surface-variant">
                        {label}
                    </p>

                    <p className={`mt-space-sm text-3xl font-semibold tracking-tight ${
                        valueStyles[tone] || valueStyles.default
                        }`} >
                        {value}
                    </p>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                    <Icon size={19} strokeWidth={1.9} />
                </span>
            </div>

            {detail && (
                <p className="mt-space-lg text-body-sm text-on-surface-variant">
                    {detail}
                </p>
            )}
        </article>
    );
}

export default StatCard;