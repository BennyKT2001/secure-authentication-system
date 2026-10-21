import { useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound, ShieldCheck, } from 'lucide-react';
import { Link, useLocation, useNavigate, } from 'react-router-dom';
import BrandLogo from '../../components/ui/BrandLogo.jsx';
import { authApi } from '../../services/api.js';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if ( newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword) || 
            !/[^A-Za-z0-9]/.test(newPassword)) {
            setErrorMessage(
                'Password must be at least 8 characters long and contain a letter, a number and a special character.',
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await authApi.resetPassword({
                email: email.trim().toLowerCase(),
                otp: otp.trim(),
                newPassword,
            });

            setSuccessMessage(
                response.message || 'Password reset successfully.',
            );

            window.setTimeout(() => {
                navigate('/login', {
                replace: true,
                state: {
                    message: 'Password reset successfully. You can now log in.',
                },
                });
            }, 1200);
        } catch (error) {
            setErrorMessage(
                error.message || 'Unable to reset your password.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface">
            <header className="border-b border-outline-variant/40 bg-surface/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-margin md:px-margin-desktop">
                    <Link to="/" aria-label="Return to AssetGuard home">
                        <BrandLogo />
                    </Link>

                    <span className="rounded bg-surface-container px-space-sm py-space-xs text-code-sm text-on-surface-variant">
                        Reset password
                    </span>
                </div>
            </header>

            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-container-low px-margin py-space-2xl md:px-margin-desktop">
                <section className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-md sm:p-space-xl">
                    <Link to="/forgot-password" className="inline-flex items-center gap-space-xs text-label-md font-label-md font-semibold text-on-surface-variant transition-colors 
                    hover:text-on-surface">
                        <ArrowLeft size={16} />
                        Back to password recovery
                    </Link>

                    <div className="mt-space-xl flex items-start gap-space-md">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-secondary shadow-sm">
                            <ShieldCheck size={24} />
                        </span>

                        <div>
                            <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                                Secure account recovery
                            </p>

                            <h1 className="mt-space-xs text-headline-lg font-headline-lg tracking-tight">
                                Reset your password
                            </h1>

                            <p className="mt-space-sm text-body-md leading-relaxed text-red-400">
                                Enter the one-time code sent to your email and choose a new
                                password.
                            </p>
                        </div>
                    </div>

                    {errorMessage && (
                        <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container" >
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div role="status" className="mt-space-lg flex items-center gap-space-sm rounded-lg bg-surface-container px-space-md py-space-sm text-body-sm text-on-tertiary-container" >
                            <CheckCircle2 size={17} />
                            {successMessage}
                        </div>
                    )}

                    <form className="mt-space-xl space-y-space-lg" onSubmit={handleSubmit} >
                        <div>
                            <label htmlFor="reset-email" className="mb-space-xs block text-label-md font-label-md
                                font-medium" >
                                Email address
                            </label>

                            <input id="reset-email" type="email" value={email}
                                onChange={(event) => setEmail(event.target.value)} autoComplete="email"
                                required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label htmlFor="reset-otp" className="mb-space-xs block text-label-md font-label-md
                                font-medium" >
                                Verification code
                            </label>

                            <input id="reset-otp" type="text" inputMode="numeric" value={otp} onChange={(event) => {
                                    setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                                    setErrorMessage('');
                                }} placeholder="Enter the 6-digit code" autoComplete="one-time-code" maxLength={6}
                                required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md tracking-[0.3em] outline-none placeholder:tracking-normal focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                        </div>

                        <div>
                            <label htmlFor="new-password" className="mb-space-xs block text-label-md font-label-md
                                font-medium" >
                                New password
                            </label>

                            <div className="relative">
                                <KeyRound size={17} className="pointer-events-none absolute left-space-sm top-1/2
                                    -translate-y-1/2 text-on-surface-variant" />

                                <input id="new-password" type="password" value={newPassword}
                                onChange={(event) => {
                                    setNewPassword(event.target.value);
                                    setErrorMessage('');
                                }}
                                placeholder="Create a strong password" autoComplete="new-password"
                                required className="h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                            </div>

                            <p className="mt-space-xs text-label-sm text-on-surface-variant">
                                Minimum 8 characters, including a letter, number and special
                                character.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="mb-space-xs block text-label-md font-label-md
                            font-medium" >
                                Confirm new password
                            </label>

                            <input id="confirm-password" type="password" value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value);
                                    setErrorMessage('');
                                }}
                                placeholder="Repeat your new password" autoComplete="new-password"
                                required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />
                        </div>

                        <button type="submit" disabled={isSubmitting || Boolean(successMessage)}
                        className="h-11 w-full rounded-lg bg-secondary text-label-md font-label-md font-semibold text-on-secondary shadow-md transition-colors hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60" >
                            {isSubmitting ? 'Resetting password...' : 'Reset password'}
                        </button>
                    </form>

                    <p className="mt-space-lg text-center text-body-sm text-on-surface-variant">
                        Remember your password?{' '}
                        <Link to="/login" className="font-label-md font-semibold text-secondary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
}

export default ResetPasswordPage;