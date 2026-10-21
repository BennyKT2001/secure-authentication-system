import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, ShieldCheck, } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/ui/BrandLogo.jsx';
import { authApi } from '../../services/api.js';

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        setIsSubmitting(true);

        try {
            await authApi.forgotPassword({
                email: email.trim().toLowerCase(),
            });

            navigate('/reset-password', {
                state: {
                email: email.trim().toLowerCase(),
                },
            });
        } catch (error) {
            setErrorMessage(
                error.message || 'Unable to process your password reset request.',
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
                        Password recovery
                    </span>
                </div>
            </header>

            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-container-low px-margin py-space-2xl md:px-margin-desktop">
                <section className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-md sm:p-space-xl">
                    <Link to="/login" className="inline-flex items-center gap-space-xs text-label-md font-label-md font-semibold text-on-surface-variant transition-colors hover:text-on-surface" >
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>

                    <div className="mt-space-xl flex items-start gap-space-md">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-secondary shadow-sm">
                            <ShieldCheck size={24} />
                        </span>

                        <div>
                            <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                                Account recovery
                            </p>

                            <h1 className="mt-space-xs text-headline-lg font-headline-lg tracking-tight">
                                Forgot your password?
                            </h1>

                            <p className="mt-space-sm text-body-md leading-relaxed text-on-surface-variant">
                                Enter your email address and we will send a secure reset code
                                if an account is associated with it.
                            </p>
                        </div>
                    </div>

                    {errorMessage && (
                        <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container">
                            {errorMessage}
                        </div>
                    )}

                    <form className="mt-space-xl space-y-space-lg" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="forgot-password-email" className="mb-space-xs block text-label-md font-label-md
                                font-medium">
                                Email address
                            </label>

                            <div className="relative">
                                <Mail size={17} className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />

                                <input id="forgot-password-email" type="email" value={email} onChange={(event) => {
                                    setEmail(event.target.value);
                                    setErrorMessage('');
                                }}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                className="h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-space-sm rounded-lg bg-secondary text-label-md font-label-md font-semibold text-on-secondary shadow-md transition-colors hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60" >
                            {isSubmitting ? 'Sending reset code...' : 'Continue'}
                            {!isSubmitting && <ArrowRight size={17} />}
                        </button>
                    </form>

                    <p className="mt-space-lg text-center text-body-sm text-on-surface-variant">
                        Remember your password?{' '}
                        <Link to="/login" className="font-label-md font-semibold text-secondary hover:underline" >
                            Sign in
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
}

export default ForgotPasswordPage;