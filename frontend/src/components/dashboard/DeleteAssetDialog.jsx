import { AlertTriangle, Trash2, X } from 'lucide-react';

function DeleteAssetDialog({
    asset,
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
}) {
    if (!isOpen || !asset) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary-container/50 px-margin py-space-lg backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section role="alertdialog" aria-modal="true" aria-labelledby="delete-asset-title"
                className="w-full max-w-md rounded-xl bg-surface-container-lowest p-space-lg shadow-xl sm:p-space-xl"
            >
                <div className="flex items-start justify-between gap-space-md">
                    <div className="flex items-start gap-space-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container text-error">
                            <AlertTriangle size={20} />
                        </span>

                        <div>
                            <h2 id="delete-asset-title" className="text-headline-md font-headline-md" >
                                Delete asset?
                            </h2>

                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                This action permanently removes the asset from the inventory.
                            </p>
                        </div>
                    </div>

                    <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                        aria-label="Close delete confirmation" >
                        <X size={19} />
                    </button>
                </div>

                <div className="mt-space-lg rounded-lg bg-surface-container-low p-space-md">
                    <p className="text-label-md font-label-md font-semibold text-on-surface">
                        {asset.name}
                    </p>

                    <p className="mt-space-xs font-code-sm text-on-surface-variant">
                        {asset.serialNumber}
                    </p>
                </div>

                <div className="mt-space-lg flex flex-col-reverse gap-space-sm border-t border-outline-variant/30 pt-space-lg sm:flex-row sm:justify-end">
                    <button type="button" onClick={onClose} className="h-11 rounded-lg bg-surface-container px-space-lg text-label-md font-label-md font-semibold text-on-surface hover:bg-surface-container-high"
                    >
                        Cancel
                    </button>

                    <button type="button" onClick={onConfirm} disabled={isDeleting} className="inline-flex h-11 items-center justify-center gap-space-sm rounded-lg bg-error px-space-lg text-label-md font-label-md font-semibold text-white hover:bg-error/90 disabled:cursor-wait disabled:opacity-60"
                    >
                        <Trash2 size={16} />
                        {isDeleting ? 'Deleting...' : 'Delete asset'}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default DeleteAssetDialog;