import { useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api.js';

const initialForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    };

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const passwordRules = {
        length: formData.password.length >= 8,
        letter: /[A-Za-z]/.test(formData.password),
        number: /\d/.test(formData.password),
        special: /[^A-Za-z0-9]/.test(formData.password),
    };

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
        ...current,
        [name]: value,
        }));

        if (errorMessage) {
        setErrorMessage('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!isPasswordValid) {
            setErrorMessage(
                'Password must contain at least 8 characters, a letter, a number and a special character.',
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            await authApi.register({
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                phoneNumber: formData.phoneNumber.trim() || undefined,
                password: formData.password,
            });

            navigate('/verify-registration-otp', {
                state: {
                email: formData.email.trim().toLowerCase(),
                },
            });
        } catch (error) {
            setErrorMessage(
                error.message || 'Unable to create your account.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background px-margin py-space-xl text-on-surface md:px-margin-desktop">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-space-2xl lg:grid-cols-2">
                <section className="hidden lg:block">
                    <div className="inline-flex items-center gap-space-sm rounded-full bg-primary-fixed px-space-md py-space-sm text-label-sm font-label-md text-secondary">
                        <ShieldCheck size={16} />
                        Secure SME asset management
                    </div>

                    <h1 className="mt-space-lg max-w-xl text-display-lg font-display-lg tracking-tight">
                        Create your secure AssetGuard workspace.
                    </h1>

                    <p className="mt-space-md max-w-xl text-body-lg text-on-surface-variant">
                        Register your account to manage digital assets through secure
                        authentication, OTP verification and role-based access control.
                    </p>

                    <div className="mt-space-xl space-y-space-md">
                        {[
                        'Email OTP verification',
                        'Secure JWT session management',
                        'Role-based asset access',
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-space-sm text-body-md text-on-surface-variant"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-fixed text-secondary">
                                    <Check size={15} />
                                </span>
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto w-full max-w-xl rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm ring-1 ring-outline-variant/20 sm:p-space-xl">
                    <div>
                        <p className="text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                            AssetGuard account
                        </p>

                        <h2 className="mt-space-sm text-headline-lg font-headline-lg">
                            Create your account
                        </h2>

                        <p className="mt-space-xs text-body-md text-on-surface-variant">
                            Enter your details to begin the verification process.
                        </p>
                    </div>

                    {errorMessage && (
                        <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container" >
                            {errorMessage}
                        </div>
                    )}

                    <form className="mt-space-xl space-y-space-md" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="register-full-name" className="mb-space-xs block text-label-md font-label-md font-medium">
                                Full name
                            </label>

                            <input id="register-full-name" name="fullName" type="text" value={formData.fullName}
                                onChange={handleChange} placeholder="e.g. Benedict Kitwa" autoComplete="name" required
                                className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label htmlFor="register-email" className="mb-space-xs block text-label-md font-label-md font-medium" >
                                Email address
                            </label>

                            <input id="register-email" name="email" type="email" value={formData.email}
                                onChange={handleChange} placeholder="you@example.com" autoComplete="email" required
                                className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label htmlFor="register-phone" className="mb-space-xs block text-label-md font-label-md font-medium" >
                                Phone number <span className="font-normal text-on-surface-variant">(optional)</span>
                            </label>

                            <input id="register-phone" name="phoneNumber" type="tel" value={formData.phoneNumber}
                                onChange={handleChange} placeholder="+27 12 345 6789" autoComplete="tel"
                                className="h-11 w-full rounded-lg bg-surface-container-low px-space-md text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label htmlFor="register-password" className="mb-space-xs block text-label-md font-label-md font-medium">
                                Password
                            </label>

                            <div className="relative">
                                <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Create a strong password"
                                autoComplete="new-password" required
                                className="h-11 w-full rounded-lg bg-surface-container-low px-4 pr-12 text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" />

                                <button type="button" onClick={() => setShowPassword((current) => !current)}
                                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
                                aria-label={showPassword ? 'Hide password' : 'Show password'} >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-confirm-password" className="mb-space-xs block text-label-md font-label-md font-medium" >
                                Confirm password
                            </label>

                            <div className="relative">
                                <input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange}
                                placeholder="Repeat your password" autoComplete="new-password" required
                                className="h-11 w-full rounded-lg bg-surface-container-low px-4 pr-12 text-body-md outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                                />

                                <button type="button" onClick={() =>
                                    setShowConfirmPassword((current) => !current)
                                }
                                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
                                aria-label={
                                    showConfirmPassword
                                    ? 'Hide confirm password'
                                    : 'Show confirm password'
                                } >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg bg-surface-container-low p-space-md">
                            <p className="text-label-sm font-label-md text-on-surface-variant">
                                Password requirements
                            </p>

                            <div className="mt-space-sm grid gap-space-xs sm:grid-cols-2">
                                {[
                                ['length', 'At least 8 characters'],
                                ['letter', 'Contains a letter'],
                                ['number', 'Contains a number'],
                                ['special', 'Contains a special character'],
                                ].map(([key, label]) => (
                                    <span key={key} className={[ 'inline-flex items-center gap-space-xs text-body-sm',
                                        passwordRules[key]
                                            ? 'text-on-tertiary-container'
                                            : 'text-on-surface-variant',
                                        ].join(' ')}
                                    >
                                        <Check size={14} />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-space-sm rounded-lg bg-secondary px-space-lg text-label-md font-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60" >
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                            {!isSubmitting && <ArrowRight size={17} />}
                        </button>
                    </form>

                    <p className="mt-space-lg text-center text-body-sm text-on-surface-variant">
                        Already have an account?{' '}
                        <Link to="/login" className="font-label-md font-semibold text-secondary hover:underline" >
                            Sign in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default RegisterPage;