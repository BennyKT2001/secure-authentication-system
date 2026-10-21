import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/ui/BrandLogo.jsx';
import { authApi } from "../../services/api.js";

const securityPoints = [
  {
    icon: CheckCircle2,
    title: 'Verified email authentication',
    text: 'Confirm every sign-in with a secure email verification code.',
  },
  {
    icon: UsersRound,
    title: 'Role-based access control',
    text: 'Keep administrator and employee permissions clearly separated.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected administrator workflows',
    text: 'Secure sensitive inventory and user-management actions.',
  },
];

function LoginPage() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [trustDevice, setTrustDevice] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await authApi.login({ email, password, trustDevice });
            navigate('/verify-login-otp', {
                state: { email },
            });
        } catch (error) {
            setErrorMessage(error.message);
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

                    <div className="hidden items-center gap-space-sm sm:flex">
                        <span className="rounded bg-surface-container px-space-sm py-space-xs text-code-sm text-on-surface-variant">
                            Auth Gateway
                        </span>

                        <Link to="/" className="text-label-md text-on-surface-variant transition-colors hover:text-on-surface" >
                            Public Portal
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1600px] lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative overflow-hidden bg-primary-container px-margin py-space-2xl text-on-primary md:px-margin-desktop lg:p-space-2xl">

                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary-container/30 blur-3xl" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-space-2xl">
                        <div>
                            <div className="flex items-center gap-space-sm">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-on-secondary shadow-md">
                                    <ShieldCheck size={20} />
                                </span>

                                <div>
                                    <p className="text-headline-sm font-headline-sm font-semibold tracking-tight">
                                        AssetGuard
                                    </p>
                                    <p className="text-code-sm text-on-primary-container">
                                        Enterprise Vault
                                    </p>
                                </div>
                            </div>

                            <div className="mt-space-2xl max-w-xl">
                                <p className="text-code-sm font-semibold uppercase tracking-[0.16em] text-secondary-fixed">
                                    Secure asset operations
                                </p>

                                <h1 className="mt-space-md text-display-lg font-display-lg tracking-tight">
                                    Welcome back to a clearer way to manage assets.
                                </h1>

                                <p className="mt-space-md max-w-lg text-body-lg leading-relaxed text-on-primary-container">
                                    Sign in to securely manage your company inventory, ownership
                                    and access from one trusted workspace.
                                </p>
                            </div>

                            <div className="mt-space-2xl space-y-space-sm">
                                {securityPoints.map(({ icon: Icon, title, text }) => (
                                    <div key={title} className="flex gap-space-sm rounded-xl bg-white/5 p-space-md transition-colors hover:bg-white/10" >
                                        <Icon size={19} className="mt-0.5 shrink-0 text-secondary-fixed" />

                                        <div>
                                            <h2 className="text-headline-sm font-headline-sm font-medium">
                                                {title}
                                            </h2>
                                            <p className="mt-space-xs text-body-sm leading-relaxed text-on-primary-container">
                                                {text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white/10 p-space-md text-code-sm text-secondary-fixed">
                            AES-256 protected session
                            <span className="mx-space-sm text-white/40">•</span>
                            Secure OTP verification
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center bg-surface-container-low px-margin py-space-2xl md:px-margin-desktop">
                    <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-md sm:p-space-xl">
                        <div>
                        <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                            Secure sign in
                        </p>

                        <h2 className="mt-space-sm text-display-lg font-display-lg tracking-tight">
                            Sign in to AssetGuard
                        </h2>

                        <p className="mt-space-sm text-body-md text-on-surface-variant">
                            Use your verified account credentials to continue.
                        </p>
                        </div>

                        <form className="mt-space-xl space-y-space-md" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div>

                                {/* Error message */}
                                {errorMessage && (
                                    <div role="alert" className="rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container">
                                        <p className="text-label-md font-label-md font-medium text-error">
                                            {errorMessage}
                                        </p>
                                    </div>
                                )}

                                <label htmlFor="email" className="mb-space-xs block text-label-md font-label-md font-medium" >
                                    Work email
                                </label>

                                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" autoComplete="email" required className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none ring-secondary transition-all placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-space-xs flex items-center justify-between">
                                    <label htmlFor="password" className="text-label-md font-label-md font-medium" >
                                        Password
                                    </label>

                                    <Link to="/forgot-password" className="font-label-md font-semibold text-secondary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required
                                        className="h-11 w-full rounded-lg bg-surface-container-low px-space-md pr-12 text-body-md outline-none ring-secondary transition-all placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2" />

                                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-on-surface-variant hover:text-on-surface"
                                        onClick={() => setShowPassword((visible) => !visible)} >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <label className="flex cursor-pointer items-center gap-space-sm text-label-md text-on-surface-variant">
                                <input type="checkbox" checked={trustDevice} onChange={(event) => setTrustDevice(event.target.checked)} className="h-4 w-4 accent-secondary" />
                                Trust this device for 30 days
                            </label>

                            <button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-space-sm rounded-lg bg-secondary text-headline-sm font-headline-sm font-semibold text-on-secondary shadow-md transition-all hover:bg-secondary-container disabled:cursor-wait disabled:opacity-70"
                            >
                                <LockKeyhole size={18} />
                                {isSubmitting ? 'Authenticating...' : 'Continue securely'}
                                {!isSubmitting && <ArrowRight size={17} />}
                            </button>
                        </form>

                        <div className="mt-space-lg flex items-start gap-space-sm rounded-lg bg-surface-container-low p-space-sm text-label-sm text-on-surface-variant">
                            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-secondary" />
                            <span>
                                Your session is protected with secure authentication and
                                role-based access.
                            </span>
                        </div>

                        <p className="mt-space-lg text-center text-body-md text-on-surface-variant">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-semibold text-secondary hover:underline" >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LoginPage;
