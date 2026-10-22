import { useEffect, useMemo, useState } from 'react';
import { Boxes, Edit, Filter, Search, SlidersHorizontal, Trash2, } from 'lucide-react';
import StatusBadge from '../../components/dashboard/StatusBadge.jsx';
import assetApi from '../../services/assetApi.js';
import AssetDetailsModal from "../../components/dashboard/AssetDetailsModal.jsx";
import DeleteAssetDialog from "../../components/dashboard/DeleteAssetDialog.jsx";
import userApi from "../../services/userApi.js";

const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'retired', label: 'Retired' },
];

function AssetInventoryPage() {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [assetToDelete, setAssetToDelete] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [employees, setEmployees] = useState([]);


    useEffect(() => {
        const timer = window.setTimeout(() => {
            const loadAssets = async () => {
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
            };

            const loadEmployees = async () => {
                try {
                    const response = await userApi.getEmployees();
                    setEmployees(response.data || []);
                } catch (error) {
                    setErrorMessage(
                        error.message || 'Unable to load employees.',
                    );
                }
            };

            loadAssets();
            loadEmployees();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const filteredAssets = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return assets.filter((asset) => {
        const matchesSearch =
            !normalizedSearch ||
            [
                asset.name,
                asset.serialNumber,
                asset.category,
                asset.description,
            ]
            .filter(Boolean)
            .some((value) =>
                value.toLowerCase().includes(normalizedSearch),
            );

        const matchesStatus =
            statusFilter === 'all' ||
            asset.status?.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
        });
    }, [assets, searchTerm, statusFilter]);

    const handleOpenDetails = (asset) => {
        setSelectedAsset(asset);
        setSuccessMessage('');
        setErrorMessage('');
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedAsset(null);
    };

    // Update Asset
    const handleSaveAsset = async (id, assetData) => {
        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await assetApi.updateAsset(id, assetData);
            const updatedAsset = response.data;

            setAssets((currentAssets) =>
                currentAssets.map((asset) =>
                    asset._id === id ? updatedAsset : asset,
                ),
            );

            setSelectedAsset(updatedAsset);
            setSuccessMessage('Asset updated successfully.');

            return true;
        } catch (error) {
            setErrorMessage(
            error.message || 'Unable to update the asset.',
            );

            return false;
        } finally {
            setIsSaving(false);
        }
    };

        const handleOpenDelete = (asset) => {
            setAssetToDelete(asset);
            setIsDeleteOpen(true);
        };

        const handleCloseDelete = () => {
            setAssetToDelete(null);
            setIsDeleteOpen(false);
        };

        const handleDeleteAsset = async () => {
            if (!assetToDelete) {
                return;
            }

            setIsDeleting(true);
            setErrorMessage('');
            setSuccessMessage('');

            try {
                await assetApi.deleteAsset(assetToDelete._id);

                setAssets((currentAssets) =>
                    currentAssets.filter((asset) => asset._id !== assetToDelete._id),
                );

                handleCloseDelete();
                setSuccessMessage('Asset deleted successfully.');
            } catch (error) {
                setErrorMessage(
                    error.message || 'Unable to delete the asset.',
                );
            } finally {
                setIsDeleting(false);
            }
        };

    return (
        <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
                <div>
                    <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
                        Administration
                    </p>

                    <h1 className="mt-space-sm text-headline-lg font-headline-lg tracking-tight md:text-display-lg">
                        Assets inventory
                    </h1>

                    <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
                        Search, review and monitor every registered company asset.
                    </p>
                </div>

                <div className="inline-flex items-center gap-space-sm text-label-md text-on-surface-variant">
                    <Boxes size={18} className="text-secondary" />
                    {isLoading ? 'Loading assets...' : `${filteredAssets.length} visible assets`}
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

            <section className="mt-space-xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
                <div className="flex flex-col gap-space-md border-b border-outline-variant/30 p-space-lg lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-xl">
                        <Search
                        size={18}
                        className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant"
                        />

                        <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by name, serial number or category..."
                        aria-label="Search assets"
                        className="h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                        />
                    </div>

                    <div className="flex items-center gap-space-sm">
                        <SlidersHorizontal size={17} className="text-on-surface-variant" />

                        <label htmlFor="status-filter" className="sr-only" >
                            Filter assets by status
                        </label>

                        <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}
                        className="h-11 rounded-lg bg-surface-container-low px-space-md text-label-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <Filter size={17} className="text-secondary" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-space-sm p-space-lg">
                        {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-16 animate-pulse rounded-lg bg-surface-container-low"
                        />
                        ))}
                    </div>
                ) : filteredAssets.length === 0 ? (
                    <div className="p-space-2xl text-center">
                        <Boxes size={32} className="mx-auto text-on-surface-variant" />

                        <h2 className="mt-space-md text-headline-md font-headline-md">
                            No matching assets
                        </h2>

                        <p className="mt-space-xs text-body-md text-on-surface-variant">
                        Try another search term or change the selected status filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1080px] text-left">
                            <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                                <tr>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Asset
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
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Assigned to
                                    </th>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Created
                                    </th>
                                    <th className="px-space-lg py-space-md text-right font-label-md">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAssets.map((asset) => (
                                    <tr key={asset._id} className="cursor-pointer border-t border-outline-variant/20 transition-colors hover:bg-surface-container-low" onClick={() => handleOpenDetails(asset)} >
                                        <td className="px-space-lg py-space-md">
                                            <p className="text-label-md font-label-md font-semibold text-on-surface">
                                                {asset.name}
                                            </p>

                                            <p className="mt-0.5 max-w-xs truncate text-body-sm text-on-surface-variant">
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

                                        <td className="px-space-lg py-space-md">
                                            {asset.assignedTo ? (
                                                <div>
                                                    <p className="text-label-md font-label-md font-semibold text-on-surface">
                                                        {asset.assignedTo.fullName || 'Assigned employee'}
                                                    </p>

                                                    {asset.assignedTo.email && (
                                                        <p className="mt-0.5 text-body-sm text-on-surface-variant">
                                                            {asset.assignedTo.email}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-body-sm text-on-surface-variant">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-space-lg py-space-md text-body-sm text-on-surface-variant">
                                            {asset.createdAt
                                                ? new Date(asset.createdAt).toLocaleDateString()
                                                : '—'}
                                        </td>

                                        <td className="px-space-lg py-space-md text-right">
                                            <div className="flex justify-end gap-space-xs">
                                                <button className="inline-flex h-9 items-center gap-space-xs rounded-lg px-space-sm text-label-sm font-label-md text-secondary hover:bg-primary-fixed"
                                                aria-label={`Edit ${asset.name}`} type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleOpenDetails(asset);
                                                }}>
                                                    <Edit size={15} />
                                                    View / edit
                                                </button>

                                                <button className="inline-flex h-9 items-center gap-space-xs rounded-lg px-space-sm text-label-sm font-label-md text-error hover:bg-error-container"
                                                aria-label={`Delete ${asset.name}`} type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleOpenDelete(asset);
                                                }} >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            <AssetDetailsModal asset={selectedAsset} isOpen={isDetailsOpen} onClose={handleCloseDetails}
                onSave={handleSaveAsset} isSaving={isSaving} employees={employees} />

            <DeleteAssetDialog asset={assetToDelete} isOpen={isDeleteOpen} onClose={handleCloseDelete}
                onConfirm={handleDeleteAsset} isDeleting={isDeleting} />
        </div>
    );
}

export default AssetInventoryPage;