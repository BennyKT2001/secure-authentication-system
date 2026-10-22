import { Activity, Boxes, CheckCircle2, ClipboardList, ShieldCheck, UsersRound, Wrench } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import StatusBadge from '../../components/dashboard/StatusBadge.jsx';
import assetApi from '../../services/assetApi.js';
import AddAssetModal from '../../components/dashboard/AddAssetModal.jsx';
import userApi from '../../services/userApi.js';

function AdminDashboard() {
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
    const [isCreatingAsset, setIsCreatingAsset] = useState(false);

    const [employees, setEmployees] = useState([]);


    // Load assets
    const loadAssets = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await assetApi.getAssets();
            setAssets(response.data || []);
        } catch (error) {
            setErrorMessage(
            error.message || 'Unable to load the asset inventory.',
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadEmployees = useCallback(async () => {
        try {
            const response = await userApi.getEmployees();
                setEmployees(response.data || []);
        } catch (error) {
                setErrorMessage(
                error.message || 'Unable to load employees.',
            );
        }
    }, []);

        useEffect(() => {
            const timer = window.setTimeout(() => {
            loadAssets();
        }, 0);

            return () => window.clearTimeout(timer);
        }, [loadAssets]);

        useEffect(() => {
            const timer = window.setTimeout(() => {
                loadEmployees();
            }, 0);

            return () => window.clearTimeout(timer);
        }, [loadEmployees]);

    const stats = useMemo(() => {
        const countByStatus = (status) =>
        assets.filter(
            (asset) => asset.status?.toLowerCase() === status,
        ).length;

        return {
        total: assets.length,
        available: countByStatus('available'),
        assigned: countByStatus('assigned'),
        maintenance: countByStatus('maintenance'),
        };
    }, [assets]);

      const handleCreateAsset = async (assetData) => {
        setIsCreatingAsset(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await assetApi.createAsset(assetData);
            await loadAssets();

            setIsAddAssetOpen(false);
            setSuccessMessage('Asset created successfully.');

            window.setTimeout(() => {
                setSuccessMessage('');
            }, 4000);

            return true;
        } catch (error) {
                setErrorMessage(
                error.message || 'Unable to create the asset.',
            );

            return false;
        } finally {
            setIsCreatingAsset(false);
        }
    };

    const recentAssets = assets.slice(0, 6);

    return (
        <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
                <div>
                    <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
                        Enterprise asset console
                    </p>

                    <h1 className="mt-space-sm text-headline-lg font-headline-lg tracking-tight md:text-display-lg">
                        Executive asset &amp; security overview
                    </h1>

                    <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
                        Monitor your company inventory, ownership and asset lifecycle from
                        one secure workspace.
                    </p>
                </div>

                <div className="flex flex-wrap gap-space-sm">
                    <button type="button" onClick={() => {
                        setErrorMessage('');
                        setSuccessMessage('');
                        setIsAddAssetOpen(true);
                    }} className="inline-flex h-10 items-center gap-space-sm rounded-lg bg-secondary px-space-md text-label-md font-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-secondary-container"c>
                        <Boxes size={17} />
                        Add new asset
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container" >
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div role="status" className="mt-space-lg rounded-lg bg-surface-container px-space-md py-space-sm text-body-sm text-on-tertiary-container" >
                    {successMessage}
                </div>
            )}

            <section className="mt-space-xl grid gap-space-md sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total assets" value={isLoading ? '—' : stats.total}
                icon={ClipboardList} detail="All registered company assets" />

                <StatCard label="Available in vault" value={isLoading ? '—' : stats.available}
                icon={CheckCircle2} tone="success" detail="Ready for assignment" />

                <StatCard label="Assigned assets" value={isLoading ? '—' : stats.assigned}
                icon={UsersRound} tone="primary" detail="Currently assigned to employees" />

                <StatCard label="Under maintenance" value={isLoading ? '—' : stats.maintenance}
                icon={Wrench} tone="danger" detail="Requires attention" />
            </section>

            <section className="mt-space-xl grid gap-space-lg xl:grid-cols-[minmax(0,1fr)_360px]">
                <article className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex flex-col gap-space-md border-b border-outline-variant/30 p-space-lg sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-headline-md font-headline-md">
                                Recent assets activity
                            </h2>
                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                Latest assets registered in the secure inventory.
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-space-xs text-label-sm text-on-tertiary-container">
                            <Activity size={15} />
                            Live inventory
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="space-y-space-sm p-space-lg">
                        {[1, 2, 3].map((item) => (
                            <div
                            key={item}
                            className="h-14 animate-pulse rounded-lg bg-surface-container-low"
                            />
                        ))}
                        </div>
                    ) : recentAssets.length === 0 ? (
                        <div className="p-space-2xl text-center">
                            <Boxes className="mx-auto text-on-surface-variant" size={28} />
                            <h3 className="mt-space-md text-headline-sm font-headline-sm">
                                No assets registered yet
                            </h3>
                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                Create your first asset to populate this inventory.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left">
                                <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    <tr>
                                        <th className="px-space-lg py-space-md font-label-md">
                                            Asset name
                                        </th>
                                        <th className="px-space-lg py-space-md font-label-md">
                                            Category
                                        </th>
                                        <th className="px-space-lg py-space-md font-label-md">
                                            Serial number
                                        </th>
                                        <th className="px-space-lg py-space-md font-label-md">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentAssets.map((asset) => (
                                        <tr key={asset._id} className="border-t border-outline-variant/20 transition-colors hover:bg-surface-container-low" >
                                            <td className="px-space-lg py-space-md">
                                                <p className="text-label-md font-label-md font-semibold text-on-surface">
                                                    {asset.name}
                                                </p>
                                                <p className="mt-0.5 text-body-sm text-on-surface-variant">
                                                    {asset.description || 'No description provided'}
                                                </p>
                                            </td>
                                            <td className="px-space-lg py-space-md text-body-md text-on-surface-variant">
                                                {asset.category || '—'}
                                            </td>
                                            <td className="px-space-lg py-space-md font-code-sm text-on-surface-variant">
                                                {asset.serialNumber}
                                            </td>
                                            <td className="px-space-lg py-space-md">
                                                <StatusBadge status={asset.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </article>

                <aside className="space-y-space-lg">
                    <article className="rounded-xl bg-primary-container p-space-lg text-on-primary shadow-sm">
                        <div className="flex items-start gap-space-sm">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-secondary">
                                <ShieldCheck size={19} />
                            </span>

                            <div>
                                <h2 className="text-headline-md font-headline-md">
                                    Secure workspace
                                </h2>
                                <p className="mt-space-xs text-body-sm text-on-primary-container">
                                    Your protected asset operations centre is active.
                                </p>
                            </div>
                        </div>

                        <div className="mt-space-lg grid grid-cols-2 gap-space-sm">
                            <div className="rounded-lg bg-white/10 p-space-sm">
                                <p className="text-label-sm text-on-primary-container">
                                    Authentication
                                </p>
                                <p className="mt-space-xs text-label-md font-semibold text-tertiary-fixed">
                                    OTP verified
                                </p>
                            </div>

                            <div className="rounded-lg bg-white/10 p-space-sm">
                                <p className="text-label-sm text-on-primary-container">
                                    Access control
                                </p>
                                <p className="mt-space-xs text-label-md font-semibold text-tertiary-fixed">
                                    RBAC active
                                </p>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                        <div className="flex items-center justify-between">
                        <h2 className="text-headline-md font-headline-md">
                            Status distribution
                        </h2>
                        <Activity size={18} className="text-secondary" />
                        </div>

                            <div className="mt-space-lg space-y-space-md">
                                {[
                                    ['Available', stats.available, 'bg-on-tertiary-container'],
                                    ['Assigned', stats.assigned, 'bg-secondary'],
                                    ['Maintenance', stats.maintenance, 'bg-error'],
                                ].map(([label, value, colorClass]) => (
                                    <div key={label}>
                                        <div className="flex items-center justify-between text-label-md">
                                            <span className="inline-flex items-center gap-space-xs text-on-surface-variant">
                                                <span className={`h-2 w-2 rounded-full ${colorClass}`} />
                                                {label}
                                            </span>
                                            <strong>{isLoading ? '—' : value}</strong>
                                        </div>

                                        <div className="mt-space-xs h-2 overflow-hidden rounded-full bg-surface-container">
                                            <div className={`h-full rounded-full ${colorClass}`}
                                            style={{
                                                width: stats.total
                                                ? `${(value / stats.total) * 100}%`
                                                : '0%',
                                            }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                </aside>
            </section>

            <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} onSubmit={handleCreateAsset}
                isSubmitting={isCreatingAsset} employees={employees} />

        </div>
    );
}

export default AdminDashboard;