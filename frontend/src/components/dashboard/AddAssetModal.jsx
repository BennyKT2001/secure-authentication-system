import { useState } from 'react';
import { X } from 'lucide-react';

const initialForm = {
    name: '',
    description: '',
    category: '',
    serialNumber: '',
    status: 'available',
};

function AddAssetModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState(initialForm);

    if (!isOpen) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
        ...current,
        [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const created = await onSubmit(formData);

        if (created) {
        setFormData(initialForm);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-container/50 px-margin py-space-lg backdrop-blur-sm" role="presentation"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
            onClose();
            }
        }}
        >
        <section role="dialog" aria-modal="true" aria-labelledby="add-asset-title"
            className="w-full max-w-xl rounded-xl bg-surface-container-lowest p-space-lg shadow-xl sm:p-space-xl" >
            <div className="flex items-start justify-between gap-space-md">
                <div>
                    <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                        Asset inventory
                    </p>

                    <h2 id="add-asset-title" className="mt-space-xs text-headline-lg font-headline-lg" >
                        Add new asset
                    </h2>

                    <p className="mt-space-xs text-body-md text-on-surface-variant">
                        Register a company asset in the secure inventory.
                    </p>
                </div>

                <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                    aria-label="Close add asset dialog" >
                    <X size={19} />
                </button>
            </div>

            <form className="mt-space-xl space-y-space-md" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="asset-name" className="mb-space-xs block text-label-md
                        font-label-md font-medium" >
                        Asset name
                    </label>

                    <input id="asset-name" name="name" value={formData.name} onChange={handleChange}
                        placeholder="e.g. MacBook Pro 16 M3" required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                    />
                </div>

                <div>
                    <label htmlFor="asset-description" className="mb-space-xs block text-label-md
                        font-label-md font-medium" >
                        Description
                    </label>

                    <textarea id="asset-description" name="description" value={formData.description}
                    onChange={handleChange} placeholder="Describe the asset and its intended use" required rows="3"
                    className="w-full resize-none rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                    />
                </div>

                <div className="grid gap-space-md sm:grid-cols-2">
                    <div>
                        <label htmlFor="asset-category" className="mb-space-xs block text-label-md font-label-md
                            font-medium" >
                            Category
                        </label>

                        <input id="asset-category" name="category" value={formData.category}
                            onChange={handleChange} placeholder="e.g. Laptop" required
                            className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                        />
                    </div>

                    <div>
                        <label htmlFor="asset-serial-number" className="mb-space-xs block text-label-md font-label-md font-medium" >
                            Serial number
                        </label>

                        <input id="asset-serial-number" name="serialNumber" value={formData.serialNumber}
                            onChange={handleChange} placeholder="e.g. AG-MBP-001" required
                            className="h-11 w-full rounded-lg bg-surface-container-low px-space-md font-code-sm outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="asset-status" className="mb-space-xs block text-label-md font-label-md
                        font-medium" >
                        Status
                    </label>

                    <select id="asset-status" name="status" value={formData.status}
                    onChange={handleChange} className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                    >
                        <option value="available">Available</option>
                        <option value="assigned">Assigned</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>

                <div className="flex flex-col-reverse gap-space-sm border-t border-outline-variant/30 pt-space-lg sm:flex-row sm:justify-end">
                    <button type="button" onClick={onClose} className="h-11 rounded-lg bg-surface-container px-space-lg text-label-md font-label-md font-semibold text-on-surface hover:bg-surface-container-high"
                    >
                        Cancel
                    </button>

                    <button type="submit" disabled={isSubmitting}
                    className="h-11 rounded-lg bg-secondary px-space-lg text-label-md font-label-md font-semibold text-on-secondary shadow-sm hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSubmitting ? 'Creating asset...' : 'Create asset'}
                    </button>
                </div>
            </form>
        </section>
        </div>
    );
}

export default AddAssetModal;