import { useEffect, useState } from 'react';
import { ShieldCheck, UserRound, X } from 'lucide-react';

const initialForm = {
    role: 'employee',
    isActive: true,
};

function UserDetailsModal({
    user,
    isOpen,
    onClose,
    onSave,
    isSaving,
}) {
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        const timer = window.setTimeout(() => {
        if (user) {
            setFormData({
            role: user.role || 'employee',
            isActive: user.isActive ?? true,
            });
        }
        }, 0);

        return () => window.clearTimeout(timer);
    }, [user]);

    if (!isOpen || !user) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
        ...current,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updated = await onSave(user._id, formData);

        if (updated) {
        onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-container/50 px-margin py-space-lg backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                onClose();
                }
            }}
        >
        <section role="dialog" aria-modal="true" aria-labelledby="user-details-title"
            className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-xl sm:p-space-xl"
        >
            <div className="flex items-start justify-between gap-space-md">
                <div className="flex items-start gap-space-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                        <UserRound size={19} />
                    </span>

                    <div>
                        <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                            Account access
                        </p>

                        <h2 id="user-details-title" className="mt-space-xs text-headline-lg font-headline-lg" >
                            Manage user
                        </h2>
                    </div>
                </div>

                <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                aria-label="Close user details" >
                    <X size={19} />
                </button>
            </div>

            <div className="mt-space-lg rounded-lg bg-surface-container-low p-space-md">
                <p className="text-label-md font-label-md font-semibold text-on-surface">
                    {user.fullName}
                </p>

                <p className="mt-space-xs text-body-sm text-on-surface-variant">
                    {user.email}
                </p>
            </div>

            <form className="mt-space-lg space-y-space-lg" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="user-role" className="mb-space-xs block text-label-md font-label-md
                    font-medium" >
                    Role
                </label>

                <div className="relative">
                    <ShieldCheck size={17} className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />

                    <select id="user-role" name="role"vvalue={formData.role} onChange={handleChange}
                        className="h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md capitalize outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
            </div>

            <label className="flex cursor-pointer items-start gap-space-sm rounded-lg bg-surface-container-low p-space-md">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                className="mt-0.5 h-4 w-4 accent-secondary" />

                <span>
                    <span className="block text-label-md font-label-md font-semibold text-on-surface">
                        Active account
                    </span>
                    <span className="mt-0.5 block text-body-sm text-on-surface-variant">
                        Inactive users cannot log in or access protected resources.
                    </span>
                </span>
            </label>

            <div className="flex flex-col-reverse gap-space-sm border-t border-outline-variant/30 pt-space-lg sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="h-11 rounded-lg bg-surface-container px-space-lg text-label-md font-label-md font-semibold text-on-surface hover:bg-surface-container-high"
                >
                    Cancel
                </button>

                <button type="submit" disabled={isSaving} className="h-11 rounded-lg bg-secondary px-space-lg text-label-md font-label-md font-semibold text-on-secondary hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60"
                >
                    {isSaving ? 'Saving changes...' : 'Save changes'}
                </button>
            </div>
            </form>
        </section>
        </div>
    );
}

export default UserDetailsModal;