import { CheckCircle2, Mail, Phone, ShieldCheck, UserRound, } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

function ProfilePage() {
    const { user } = useOutletContext();

    const initials = user?.fullName
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="mx-auto max-w-[1100px]">
            <div>
                <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
                    Account
                </p>

                <h1 className="mt-space-sm text-headline-lg font-headline-lg tracking-tight md:text-display-lg">
                    Profile
                </h1>

                <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
                    Review your account information and verification status.
                </p>
            </div>

            <section className="mt-space-xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
                <div className="bg-primary-container px-space-lg py-space-xl text-on-primary md:px-space-xl">
                    <div className="flex flex-col items-start gap-space-lg sm:flex-row sm:items-center">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-semibold text-on-secondary ring-4 ring-on-primary/10">
                            {initials || <UserRound size={30} />}
                        </span>

                        <div>
                            <p className="text-headline-md font-headline-md">
                                {user?.fullName || 'User'}
                            </p>

                            <p className="mt-space-xs text-body-md text-on-primary-container">
                                {user?.role === 'admin' ? 'Administrator' : 'Employee'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-space-lg p-space-lg md:grid-cols-2 md:p-space-xl">
                    <div className="rounded-lg bg-surface-container-low p-space-md">
                        <div className="flex items-center gap-space-sm text-secondary">
                            <Mail size={18} />
                            <p className="text-label-md font-label-md font-semibold">
                                Email address
                            </p>
                        </div>

                        <p className="mt-space-sm break-all text-body-md text-on-surface">
                            {user?.email || 'Not available'}
                        </p>
                    </div>

                    <div className="rounded-lg bg-surface-container-low p-space-md">
                        <div className="flex items-center gap-space-sm text-secondary">
                            <Phone size={18} />
                            <p className="text-label-md font-label-md font-semibold">
                                Phone number
                            </p>
                        </div>

                        <p className="mt-space-sm text-body-md text-on-surface">
                            {user?.phoneNumber || 'No phone number provided'}
                        </p>
                    </div>

                    <div className="rounded-lg bg-surface-container-low p-space-md">
                        <div className="flex items-center gap-space-sm text-secondary">
                            <ShieldCheck size={18} />
                            <p className="text-label-md font-label-md font-semibold">
                                Account role
                            </p>
                        </div>

                        <p className="mt-space-sm capitalize text-body-md text-on-surface">
                            {user?.role || 'Unknown'}
                        </p>
                    </div>

                    <div className="rounded-lg bg-surface-container-low p-space-md">
                        <div className="flex items-center gap-space-sm text-on-tertiary-container">
                            <CheckCircle2 size={18} />
                            <p className="text-label-md font-label-md font-semibold">
                                Verification status
                            </p>
                        </div>

                        <p className="mt-space-sm text-body-md text-on-surface">
                            {user?.isVerified ? 'Email verified' : 'Email not verified'}
                        </p>
                    </div>
                </div>

                <div className="border-t border-outline-variant/30 px-space-lg py-space-md md:px-space-xl">
                    <p className="text-body-sm text-on-surface-variant">
                        Your role and access permissions are managed securely by AssetGuard.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default ProfilePage;