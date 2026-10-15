import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Laptop,
  PackageOpen,
  Search,
  ShieldCheck,
} from 'lucide-react';
import assetApi from '../../services/assetApi.js';

function getStatusClasses(status) {
    const classes = {
        available: 'bg-surface-container text-on-tertiary-container',
        assigned: 'bg-primary-fixed text-secondary',
        maintenance: 'bg-error-container text-on-error-container',
        retired: 'bg-surface-container-high text-on-surface-variant',
        stolen: 'bg-error-container text-on-error-container',
    };

    return classes[status] || classes.available;
}

function MyAssignedAssetsPage() {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const timer = window.setTimeout(() => {
        const loadMyAssets = async () => {
            try {
            const response = await assetApi.getMyAssets();
            setAssets(response.data || []);
            } catch (error) {
            setErrorMessage(
                error.message || 'Unable to load your assigned assets.',
            );
            } finally {
            setIsLoading(false);
            }
        };

        loadMyAssets();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const filteredAssets = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
        return assets;
        }

        return assets.filter((asset) =>
        [
            asset.name,
            asset.description,
            asset.category,
            asset.serialNumber,
            asset.status,
        ]
            .filter(Boolean)
            .some((value) =>
            value.toLowerCase().includes(normalizedSearch),
            ),
        );
    }, [assets, searchTerm]);

    return (
        <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
                <div>
                    <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
                        Employee workspace
                    </p>

                    <h1 className="mt-space-sm text-headline-lg font-headline-lg tracking-tight md:text-display-lg">
                        My assigned assets
                    </h1>

                    <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
                        View the equipment currently assigned to your account.
                    </p>
                </div>

                <div className="inline-flex items-center gap-space-sm text-label-md text-on-surface-variant">
                    <ShieldCheck size={18} className="text-secondary" />
                    {isLoading
                        ? 'Loading your inventory...'
                        : `${filteredAssets.length} assigned asset${filteredAssets.length === 1 ? '' : 's'}`}
                </div>
            </div>

            {errorMessage && (
                <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container" >
                    {errorMessage}
                </div>
            )}

            <section className="mt-space-xl rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
                <div className="flex flex-col gap-space-md border-b border-outline-variant/30 p-space-lg md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-headline-md font-headline-md">
                            Assigned equipment
                        </h2>

                        <p className="mt-space-xs text-body-sm text-on-surface-variant">
                            These assets are linked to your employee account.
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search size={18} className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2
                        text-on-surface-variant/70 md:text-on-surface-variant" />

                        <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search assigned assets..." aria-label="Search assigned assets"
                        className="h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-space-sm p-space-lg">
                        {[1, 2, 3].map((item) => (
                            <div key={item}
                                className="h-24 animate-pulse rounded-lg bg-surface-container-low"
                            />
                        ))}
                    </div>
                ) : filteredAssets.length === 0 ? (
                    <div className="p-space-2xl text-center">
                        <PackageOpen size={38} className="mx-auto text-on-surface-variant" />

                        <h2 className="mt-space-md text-headline-md font-headline-md">
                            No assigned assets
                        </h2>

                        <p className="mx-auto mt-space-xs max-w-md text-body-md text-on-surface-variant">
                            You do not currently have any assets assigned to your account.
                            Contact an administrator if you believe this is incorrect.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-outline-variant/20">
                        {filteredAssets.map((asset) => (
                            <article key={asset._id} className="flex flex-col gap-space-lg p-space-lg transition-colors hover:bg-surface-container-low md:flex-row md:items-center md:justify-between" >
                                <div className="flex items-start gap-space-md">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-secondary">
                                        <Laptop size={22} />
                                    </span>

                                    <div>
                                        <h3 className="text-headline-sm font-headline-sm">
                                            {asset.name}
                                        </h3>

                                        <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                            {asset.description || 'No description provided'}
                                        </p>

                                        <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-space-xs text-label-sm text-on-surface-variant">
                                            <span>{asset.category}</span>
                                            <span className="font-code-sm">
                                                {asset.serialNumber}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-space-sm md:items-end">
                                    <span className={['inline-flex rounded-full px-space-sm py-space-xs text-label-sm font-label-md font-semibold capitalize',
                                        getStatusClasses(asset.status),
                                        ].join(' ')} >
                                        {asset.status}
                                    </span>

                                    <span className="inline-flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                                        <CalendarDays size={15} />
                                        Updated{' '}
                                        {asset.updatedAt
                                        ? new Date(asset.updatedAt).toLocaleDateString()
                                        : '—'}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default MyAssignedAssetsPage;