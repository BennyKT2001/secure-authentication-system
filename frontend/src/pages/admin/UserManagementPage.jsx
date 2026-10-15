import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit, Search, ShieldCheck, UserRound, Trash2, UsersRound, XCircle, } from 'lucide-react';
import userApi from '../../services/userApi.js';
import UserDetailsModal from '../../components/dashboard/UserDetailsModal.jsx';
import DeleteUserDialog from '../../components/dashboard/DeleteUserDialog.jsx';

const roleOptions = [
    { value: 'all', label: 'All roles' },
    { value: 'admin', label: 'Administrators' },
    { value: 'employee', label: 'Employees' },
];

const activityOptions = [
    { value: 'all', label: 'All account states' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activityFilter, setActivityFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
        const loadUsers = async () => {
            try {
            const response = await userApi.getUsers();
            setUsers(response.data || []);
            } catch (error) {
            setErrorMessage(
                error.message || 'Unable to load the user directory.',
            );
            } finally {
            setIsLoading(false);
            }
        };

        loadUsers();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const filteredUsers = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return users.filter((user) => {
        const matchesSearch =
            !normalizedSearch ||
            [user.fullName, user.email, user.phoneNumber]
            .filter(Boolean)
            .some((value) =>
                value.toLowerCase().includes(normalizedSearch),
            );

        const matchesRole =
            roleFilter === 'all' || user.role === roleFilter;

        const matchesActivity =
            activityFilter === 'all' ||
            (activityFilter === 'active' && user.isActive) ||
            (activityFilter === 'inactive' && !user.isActive);

        return matchesSearch && matchesRole && matchesActivity;
        });
    }, [users, searchTerm, roleFilter, activityFilter]);

    const adminCount = users.filter((user) => user.role === 'admin').length;
    const employeeCount = users.filter(
        (user) => user.role === 'employee',
    ).length;
    const inactiveCount = users.filter((user) => !user.isActive).length;

    const handleOpenDetails = (user) => {
        setSelectedUser(user);
        setErrorMessage('');
        setSuccessMessage('');
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async (id, userData) => {
        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await userApi.updateUser(id, userData);
            const updatedUser = response.data;

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user._id === id ? updatedUser : user,
                ),
            );

            setSelectedUser(updatedUser);
            setSuccessMessage('User updated successfully.');

            return true;
        } catch (error) {
                setErrorMessage(
                error.message || 'Unable to update the user.',
            );

            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenDelete = (user) => {
        setUserToDelete(user);
        setErrorMessage('');
        setSuccessMessage('');
        setIsDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        setUserToDelete(null);
        setIsDeleteOpen(false);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) {
            return;
        }

        setIsDeleting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await userApi.deleteUser(userToDelete._id);

            setUsers((currentUsers) =>
                currentUsers.filter((user) => user._id !== userToDelete._id),
            );

            handleCloseDelete();
            setSuccessMessage('User deleted successfully.');
        } catch (error) {
            setErrorMessage(
            error.message || 'Unable to delete the user.',
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
                        User management
                    </h1>

                    <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
                        Review account access, roles and verification status across your
                        organisation.
                    </p>
                </div>

                <div className="inline-flex items-center gap-space-sm text-label-md text-on-surface-variant">
                    <UsersRound size={18} className="text-secondary" />
                    {isLoading ? 'Loading users...' : `${filteredUsers.length} visible users`}
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

            <section className="mt-space-xl grid gap-space-md sm:grid-cols-3">
                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-center justify-between">
                        <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                            Total users
                        </p>
                        <UsersRound size={19} className="text-secondary" />
                    </div>
                    <p className="mt-space-sm text-3xl font-semibold">
                        {isLoading ? '—' : users.length}
                    </p>
                </article>

                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-center justify-between">
                        <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                            Administrators
                        </p>
                        <ShieldCheck size={19} className="text-secondary" />
                    </div>
                    <p className="mt-space-sm text-3xl font-semibold text-secondary">
                        {isLoading ? '—' : adminCount}
                    </p>
                </article>

                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-center justify-between">
                        <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                            Inactive accounts
                        </p>
                        <XCircle size={19} className="text-error" />
                    </div>
                    <p className="mt-space-sm text-3xl font-semibold text-error">
                        {isLoading ? '—' : inactiveCount}
                    </p>
                    <p className="mt-space-sm text-body-sm text-on-surface-variant">
                        {employeeCount} employee accounts currently registered
                    </p>
                </article>
            </section>

            <section className="mt-space-xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
                <div className="flex flex-col gap-space-md border-b border-outline-variant/30 p-space-lg lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-xl">
                        <Search size={18} className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />

                        <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by name, email or phone..." aria-label="Search users"
                        className="h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                    </div>

                    <div className="flex flex-col gap-space-sm sm:flex-row">
                        <label htmlFor="user-role-filter" className="sr-only">
                            Filter users by role
                        </label>

                        <select id="user-role-filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-11 rounded-lg bg-surface-container-low px-space-md text-label-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="user-activity-filter" className="sr-only">
                            Filter users by account state
                        </label>

                        <select id="user-activity-filter" value={activityFilter} onChange={(event) => setActivityFilter(event.target.value)} className="h-11 rounded-lg bg-surface-container-low px-space-md text-label-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" >
                            {activityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-space-sm p-space-lg">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item}
                                className="h-16 animate-pulse rounded-lg bg-surface-container-low"
                            />
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-space-2xl text-center">
                        <UserRound size={32} className="mx-auto text-on-surface-variant" />

                        <h2 className="mt-space-md text-headline-md font-headline-md">
                            No matching users
                        </h2>

                        <p className="mt-space-xs text-body-md text-on-surface-variant">
                            Try another search term or change the selected filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1120px] text-left">
                            <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                                <tr>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        User
                                    </th>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Contact
                                    </th>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Role
                                    </th>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Verification
                                    </th>
                                    <th className="px-space-lg py-space-md font-label-md">
                                        Account state
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
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-t border-outline-variant/20 transition-colors hover:bg-surface-container-low" >
                                        <td className="px-space-lg py-space-md">
                                            <div className="flex items-center gap-space-sm">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-label-md font-label-md font-semibold text-secondary">
                                                    {user.fullName
                                                        ?.split(' ')
                                                        .map((part) => part[0])
                                                        .join('')
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </span>

                                                <div>
                                                <p className="text-label-md font-label-md font-semibold text-on-surface">
                                                    {user.fullName}
                                                </p>

                                                <p className="mt-0.5 text-body-sm text-on-surface-variant">
                                                    ID: {user._id}
                                                </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-space-lg py-space-md">
                                            <p className="text-body-md text-on-surface">
                                                {user.email}
                                            </p>
                                            <p className="mt-0.5 text-body-sm text-on-surface-variant">
                                                {user.phoneNumber || 'No phone number'}
                                            </p>
                                        </td>

                                        <td className="px-space-lg py-space-md">
                                            <span className="inline-flex items-center gap-space-xs rounded-full bg-primary-fixed px-space-sm py-space-xs text-label-sm font-label-md font-semibold capitalize text-secondary">
                                                <ShieldCheck size={14} />
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-space-lg py-space-md">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-space-xs text-label-sm font-label-md text-on-tertiary-container">
                                                    <CheckCircle2 size={15} />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-space-xs text-label-sm font-label-md text-on-surface-variant">
                                                    <XCircle size={15} />
                                                    Unverified
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-space-lg py-space-md">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-space-xs text-label-sm font-label-md font-semibold text-on-tertiary-container">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-on-tertiary-container" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-space-xs rounded-full bg-error-container px-space-sm py-space-xs text-label-sm font-label-md font-semibold text-on-error-container">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-error" />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-space-lg py-space-md text-body-sm text-on-surface-variant">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : '—'}
                                        </td>

                                        <td className="px-space-lg py-space-md text-right">
                                            <div className="flex justify-end gap-space-xs">
                                                <button type="button" onClick={() => handleOpenDetails(user)} className="inline-flex h-9 items-center gap-space-xs rounded-lg px-space-sm text-label-sm font-label-md text-secondary hover:bg-primary-fixed" aria-label={`Manage ${user.fullName}`} >
                                                    <Edit size={15} />
                                                    Manage
                                                </button>

                                                <button type="button" onClick={() => handleOpenDelete(user)}
                                                className="inline-flex h-9 items-center gap-space-xs rounded-lg px-space-sm text-label-sm font-label-md text-error hover:bg-error-container" aria-label={`Delete ${user.fullName}`} >
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

            <UserDetailsModal user={selectedUser} isOpen={isDetailsOpen} onClose={handleCloseDetails} onSave={handleSaveUser} isSaving={isSaving} />

            <DeleteUserDialog user={userToDelete} isOpen={isDeleteOpen} onClose={handleCloseDelete} onConfirm={handleDeleteUser} isDeleting={isDeleting} />
        </div>
    );
}

export default UserManagementPage;