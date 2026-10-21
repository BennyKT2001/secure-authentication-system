import { CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, UserCog, } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

function SettingsSecurityPage() {
    const { user } = useOutletContext();

    const isAdmin = user?.role === 'admin';

    return (
        <div className="mx-auto max-w-[1100px]">
            <div>
                <p className="text-label-sm font-label-md uppercase tracking-wider text-secondary">
                    System
                </p>

                <h1 className="mt-space-sm text-headline-lg font-headline-lg tracking-tight md:text-display-lg">
                    Settings & security
                </h1>

                <p className="mt-space-sm max-w-2xl text-body-md text-on-surface-variant">
                    Review your account security, authentication status and access level.
                </p>
            </div>

            <section className="mt-space-xl grid gap-space-md md:grid-cols-2">
                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-start gap-space-md">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                            <LockKeyhole size={20} />
                        </span>

                        <div>
                            <h2 className="text-headline-md font-headline-md">
                                Secure session
                            </h2>

                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                Your authenticated session is protected using a secure
                                HTTP-only cookie.
                            </p>

                            <span className="mt-space-md inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-space-xs text-label-sm font-label-md font-semibold text-on-tertiary-container">
                                <CheckCircle2 size={14} />
                                Session protected
                            </span>
                        </div>
                    </div>
                </article>

                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-start gap-space-md">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                            <KeyRound size={20} />
                        </span>

                        <div>
                            <h2 className="text-headline-md font-headline-md">
                                Multi-factor authentication
                            </h2>

                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                Login verification requires a one-time code sent to your
                                registered email address.
                            </p>

                            <span className="mt-space-md inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-space-xs text-label-sm font-label-md font-semibold text-on-tertiary-container">
                                <CheckCircle2 size={14} />
                                Email OTP enabled
                            </span>
                        </div>
                    </div>
                </article>

                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-start gap-space-md">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                            <ShieldCheck size={20} />
                        </span>

                        <div>
                            <h2 className="text-headline-md font-headline-md">
                                Account status
                            </h2>

                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                Your access depends on the current status of your account.
                            </p>

                            <span
                                className={[
                                'mt-space-md inline-flex items-center gap-space-xs rounded-full px-space-sm py-space-xs text-label-sm font-label-md font-semibold',
                                user?.isActive
                                    ? 'bg-surface-container text-on-tertiary-container'
                                    : 'bg-error-container text-on-error-container',
                                ].join(' ')}
                            >
                                <span
                                className={[
                                    'h-1.5 w-1.5 rounded-full',
                                    user?.isActive ? 'bg-on-tertiary-container' : 'bg-error',
                                ].join(' ')}
                                />
                                {user?.isActive ? 'Active account' : 'Inactive account'}
                            </span>
                        </div>
                    </div>
                </article>

                <article className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                    <div className="flex items-start gap-space-md">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                            <UserCog size={20} />
                        </span>

                        <div>
                            <h2 className="text-headline-md font-headline-md">
                                Access level
                            </h2>

                            <p className="mt-space-xs text-body-sm text-on-surface-variant">
                                Your available features are controlled by role-based access
                                control.
                            </p>

                            <span className="mt-space-md inline-flex rounded-full bg-primary-fixed px-space-sm py-space-xs text-label-sm font-label-md font-semibold capitalize text-secondary">
                                {isAdmin ? 'Administrator access' : 'Employee access'}
                            </span>
                        </div>
                    </div>
                </article>
            </section>

            <section className="mt-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20">
                <div className="flex items-start gap-space-md">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-fixed text-secondary">
                        <KeyRound size={20} />
                    </span>

                    <div>
                        <h2 className="text-headline-md font-headline-md">
                            Password recovery
                        </h2>

                        <p className="mt-space-xs max-w-2xl text-body-md text-on-surface-variant">
                            Password reset will be available through a secure email
                            verification flow.
                        </p>

                        <span className="mt-space-md inline-flex rounded-full bg-surface-container px-space-sm py-space-xs text-label-sm font-label-md text-on-surface-variant">
                            Coming soon
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SettingsSecurityPage;