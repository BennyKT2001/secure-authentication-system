import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, MailCheck, ShieldCheck, } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/ui/BrandLogo.jsx';
import { authApi } from '../../services/api.js';

function VerifyLoginOtpPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const email = location.state?.email || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [secondsLeft, setSecondsLeft] = useState(300);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!email) {
        navigate('/login', { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (secondsLeft <= 0) {
        return undefined;
        }

        const timer = window.setInterval(() => {
        setSecondsLeft((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [secondsLeft]);

    const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(
        2,
        '0',
    )}:${String(secondsLeft % 60).padStart(2, '0')}`;

    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1);

        setOtp((current) => {
        const next = [...current];
        next[index] = digit;
        return next;
        });

        setErrorMessage('');

        if (digit && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (
        event.key === 'Backspace' &&
        !otp[index] &&
        index > 0
        ) {
        inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const code = otp.join('');

        if (code.length !== 6) {
        setErrorMessage('Please enter the complete six-digit verification code.');
        return;
        }

        setIsSubmitting(true);

        try {
            const response = await authApi.verifyLoginOtp({
                email,
                otp: code,
            });

            setSuccessMessage(response.message || 'Login verified successfully.');

            window.setTimeout(() => {
                const destination =
                    response.data?.role === 'admin'
                    ? '/dashboard'
                    : '/my-assets';

                navigate(destination, {
                    replace: true,
                    state: { user: response.data },
                });
            }, 500);
        } catch (error) {
            setErrorMessage(
            error.message || 'The verification code is invalid or expired.',
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
                Auth Gateway
            </span>
            </div>
        </header>

        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-container-low px-margin py-space-2xl md:px-margin-desktop">
            <section className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-md sm:p-space-xl">
            <Link
                to="/login"
                className="inline-flex items-center gap-space-xs text-label-md font-label-md font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
            >
                <ArrowLeft size={16} />
                Back to login
            </Link>

            <div className="mt-space-xl flex items-start gap-space-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-secondary shadow-sm">
                <MailCheck size={24} />
                </span>

                <div>
                <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                    Two-factor verification
                </p>

                <h1 className="mt-space-xs text-headline-lg font-headline-lg tracking-tight">
                    Verification code sent
                </h1>

                <p className="mt-space-sm text-body-md leading-relaxed text-on-surface-variant">
                    Enter the six-digit code sent to{' '}
                    <strong className="text-on-surface">{email}</strong>.
                </p>
                </div>
            </div>

            <form className="mt-space-xl" onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-space-sm">
                {otp.map((digit, index) => (
                    <input
                    key={index}
                    ref={(element) => {
                        inputRefs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) =>
                        handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Verification digit ${index + 1}`}
                    className="h-14 w-full rounded-lg bg-surface-container-low text-center font-code-badge text-[22px] font-bold text-on-surface outline-none ring-secondary transition-all focus:bg-surface-container-lowest focus:ring-2"
                    />
                ))}
                </div>

                {errorMessage && (
                <div
                    role="alert"
                    className="mt-space-md rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container"
                >
                    {errorMessage}
                </div>
                )}

                {successMessage && (
                <div
                    role="status"
                    className="mt-space-md flex items-center gap-space-sm rounded-lg bg-surface-container px-space-md py-space-sm text-body-sm text-on-tertiary-container"
                >
                    <CheckCircle2 size={17} />
                    {successMessage}
                </div>
                )}

                <div className="mt-space-md flex items-center justify-between text-body-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-space-xs font-code-sm">
                    <Clock3 size={16} className="text-secondary" />
                    Expires in{' '}
                    <strong className="text-secondary">{formattedTime}</strong>
                </span>

                <span className="text-label-md text-on-surface-variant">
                    Resend available later
                </span>
                </div>

                <button
                type="submit"
                disabled={isSubmitting || secondsLeft === 0}
                className="mt-space-lg inline-flex h-11 w-full items-center justify-center gap-space-sm rounded-lg bg-secondary text-headline-sm font-headline-sm font-semibold text-on-secondary shadow-md transition-colors hover:bg-secondary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                <ShieldCheck size={18} />
                {isSubmitting ? 'Verifying securely...' : 'Verify and access vault'}
                {!isSubmitting && <ArrowRight size={17} />}
                </button>
            </form>

            <p className="mt-space-lg text-center text-label-sm text-on-surface-variant">
                The code expires after five minutes for your security.
            </p>
            </section>
        </main>
        </div>
    );
}

export default VerifyLoginOtpPage;
