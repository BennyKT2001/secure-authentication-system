import { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

const emptyAsset = {
    name: '',
    description: '',
    category: '',
    serialNumber: '',
    status: 'available',
};

function AssetDetailsModal({
    asset,
    isOpen,
    onClose,
    onSave,
    isSaving,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(emptyAsset);

    // Pre-fill the form
    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (asset) {
                setFormData({
                    name: asset.name || '',
                    description: asset.description || '',
                    category: asset.category || '',
                    serialNumber: asset.serialNumber || '',
                    status: asset.status || 'available',
                });
            }
            setIsEditing(false);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [asset]);

    if (!isOpen || !asset) {
        return null;
    }

    // Update the form
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
        ...current,
        [name]: value,
        }));
    };

    // Update the asset
    const handleSubmit = async (event) => {
        event.preventDefault();

        const updated = await onSave(asset._id, formData);

        if (updated) {
        setIsEditing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-container/50 px-margin py-space-lg backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
                onClose();
            }
        }}
        >
            <section role="dialog" aria-modal="true" aria-labelledby="asset-details-title"
                className="w-full max-w-xl rounded-xl bg-surface-container-lowest p-space-lg shadow-xl sm:p-space-xl" >
                <div className="flex items-start justify-between gap-space-md">
                    <div>
                        <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                            Asset details
                        </p>

                        <h2 id="asset-details-title" className="mt-space-xs text-headline-lg font-headline-lg" >
                            {isEditing ? 'Edit asset' : asset.name}
                        </h2>

                        <p className="mt-space-xs text-body-sm text-on-surface-variant">
                            Review the asset record and its current lifecycle status.
                        </p>
                    </div>

                    <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                        aria-label="Close asset details">
                        <X size={19} />
                    </button>
                </div>

                {!isEditing ? (
                    <>
                        <div className="mt-space-xl grid gap-space-md sm:grid-cols-2">
                            <div className="rounded-lg bg-surface-container-low p-space-md">
                                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    Asset Category
                                </p>
                                <p className="mt-space-xs text-label-md font-semibold text-on-surface">
                                    {asset.category || '—'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-surface-container-low p-space-md">
                                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    Serial number
                                </p>
                                <p className="mt-space-xs font-code-sm text-on-surface">
                                    {asset.serialNumber || '—'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-surface-container-low p-space-md">
                                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    Status
                                </p>
                                <div className="mt-space-sm">
                                    <StatusBadge status={asset.status} />
                                </div>
                            </div>

                            <div className="rounded-lg bg-surface-container-low p-space-md">
                                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                                    Date Created
                                </p>
                                <p className="mt-space-xs text-body-sm text-on-surface">
                                    {asset.createdAt
                                        ? new Date(asset.createdAt).toLocaleDateString()
                                        : '—'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-space-md rounded-lg bg-surface-container-low p-space-md">
                            <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                                Description
                            </p>
                            <p className="mt-space-xs text-body-md text-on-surface">
                                {asset.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="mt-space-lg flex justify-end gap-space-sm border-t border-outline-variant/30 pt-space-lg">
                            <button type="button" onClick={onClose} className="h-11 rounded-lg bg-surface-container px-space-lg text-label-md font-label-md font-semibold text-on-surface hover:bg-surface-container-high"
                            >
                                Close
                            </button>

                            <button type="button" onClick={() => setIsEditing(true)} className="inline-flex h-11 items-center gap-space-sm rounded-lg bg-secondary px-space-lg text-label-md font-label-md font-semibold text-on-secondary hover:bg-secondary-container" >
                                <Pencil size={16} />
                                Edit asset
                            </button>
                        </div>
                    </>
                ) : (
                    <form className="mt-space-xl space-y-space-md" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="edit-asset-name" className="mb-space-xs block text-label-md font-label-md
                                font-medium" >
                                Asset name
                            </label>

                            <input id="edit-asset-name" name="name" value={formData.name} onChange={handleChange} required
                                className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-asset-description" className="mb-space-xs block text-label-md font-label-md        font-medium">
                                Description
                            </label>

                            <textarea id="edit-asset-description" name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full resize-none rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                        </div>

                        <div className="grid gap-space-md sm:grid-cols-2">
                            <div>
                                <label htmlFor="edit-asset-category" className="mb-space-xs block text-label-md font-label-md font-medium" >
                                    Category
                                </label>

                                <input id="edit-asset-category" name="category" value={formData.category} onChange={handleChange}
                                required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                            </div>

                            <div>
                                <label htmlFor="edit-asset-serial-number" className="mb-space-xs block text-label-md font-label-md font-medium" >
                                    Serial number
                                </label>

                                <input id="edit-asset-serial-number" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md font-code-sm outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="edit-asset-status" className="mb-space-xs block text-label-md font-label-md    font-medium">
                                Status
                            </label>

                            <select id="edit-asset-status" name="status" value={formData.status} onChange={handleChange}
                                className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" >
                                <option value="available">Available</option>
                                <option value="assigned">Assigned</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>

                        <div className="flex flex-col-reverse gap-space-sm border-t border-outline-variant/30 pt-space-lg  sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setIsEditing(false)} className="h-11 rounded-lg bg-surface-container px-space-lg text-label-md font-label-md font-semibold text-on-surface hover:bg-surface-container-high" >
                                Cancel
                            </button>

                            <button type="submit" disabled={isSaving} className="h-11 rounded-lg bg-secondary px-space-lg text-label-md font-label-md font-semibold text-on-secondary hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60" >
                                {isSaving ? 'Saving changes...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}

export default AssetDetailsModal;