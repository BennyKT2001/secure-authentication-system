import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, FileSearch, ShieldCheck, UserRound, } from 'lucide-react';
import auditLogApi from '../../services/auditLogApi.js';

const actionStyles = {
  ASSET_CREATED: {
    label: 'Asset created',
    className: 'bg-surface-container text-on-tertiary-container',
    icon: CheckCircle2,
  },
  ASSET_ASSIGNED: {
    label: 'Asset assigned',
    className: 'bg-primary-fixed text-secondary',
    icon: UserRound,
  },
  ASSET_ASSIGNED_ON_CREATE: {
    label: 'Asset assigned on creation',
    className: 'bg-primary-fixed text-secondary',
    icon: UserRound,
  },
  ASSET_UNASSIGNED: {
    label: 'Asset unassigned',
    className: 'bg-surface-container text-on-surface-variant',
    icon: Activity,
  },
  ASSET_UPDATED: {
    label: 'Asset updated',
    className: 'bg-secondary-fixed text-secondary',
    icon: Activity,
  },
  ASSET_DELETED: {
    label: 'Asset deleted',
    className: 'bg-error-container text-on-error-container',
    icon: AlertTriangle,
  },
  USER_UPDATED: {
    label: 'User updated',
    className: 'bg-secondary-fixed text-secondary',
    icon: UserRound,
  },
  USER_DELETED: {
    label: 'User deleted',
    className: 'bg-error-container text-on-error-container',
    icon: AlertTriangle,
  },
};

function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getActionStyle(action) {
  return (
    actionStyles[action] || {
      label: action?.replaceAll('_', ' ') || 'System action',
      className: 'bg-surface-container text-on-surface-variant',
      icon: Activity,
    }
  );
}

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loadLogs = async () => {
        try {
          const response = await auditLogApi.getLogs();
          setLogs(response.data || []);
        } catch (error) {
          setErrorMessage(
            error.message || 'Unable to load audit logs.',
          );
        } finally {
          setIsLoading(false);
        }
      };

      loadLogs();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
        <div>
          <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
            Security monitoring
          </p>

          <h1 className="mt-space-sm text-headline-lg font-headline-lg tracking-tight md:text-display-lg">
            Audit log
          </h1>

          <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
            Review sensitive actions performed across the AssetGuard workspace.
          </p>
        </div>

        <div className="inline-flex items-center gap-space-sm text-label-md text-on-surface-variant">
          <ShieldCheck size={18} className="text-secondary" />
          {isLoading ? 'Loading activity...' : `${logs.length} recorded events`}
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-body-sm
          text-on-error-container" >
          {errorMessage}
        </div>
      )}

      <section className="mt-space-xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
        <div className="flex items-center gap-space-sm border-b border-outline-variant/30 p-space-lg">
          <FileSearch size={19} className="text-secondary" />

          <div>
            <h2 className="text-headline-md font-headline-md">
              Recent security activity
            </h2>

            <p className="mt-space-xs text-body-sm text-on-surface-variant">
              The newest events are displayed first.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-space-sm p-space-lg">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-lg bg-surface-container-low"
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-space-2xl text-center">
            <Activity
              size={32}
              className="mx-auto text-on-surface-variant"
            />

            <h3 className="mt-space-md text-headline-md font-headline-md">
              No audit activity yet
            </h3>

            <p className="mt-space-xs text-body-md text-on-surface-variant">
              Sensitive system actions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {logs.map((log) => {
              const style = getActionStyle(log.action);
              const ActionIcon = style.icon;

              return (
                <article
                  key={log._id}
                  className="flex flex-col gap-space-md p-space-lg transition-colors hover:bg-surface-container-low sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-space-md">
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.className}`}
                    >
                      <ActionIcon size={18} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-space-sm">
                        <h3 className="text-label-md font-label-md font-semibold text-on-surface">
                          {style.label}
                        </h3>

                        <span className="rounded px-space-sm py-space-xs font-code-sm text-on-surface-variant">
                          {log.entityType}
                        </span>
                      </div>

                      <p className="mt-space-xs text-body-md text-on-surface-variant">
                        {log.description}
                      </p>

                      <p className="mt-space-sm text-body-sm text-on-surface-variant">
                        Performed by{' '}
                        <span className="font-label-md font-semibold text-on-surface">
                          {log.performedBy?.fullName || 'Unknown user'}
                        </span>

                        {log.performedBy?.email
                          ? ` (${log.performedBy.email})`
                          : ''}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex shrink-0 items-center gap-space-xs text-body-sm text-on-surface-variant sm:pt-1">
                    <Clock3 size={15} />
                    {formatDate(log.createdAt)}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default AuditLogPage;
