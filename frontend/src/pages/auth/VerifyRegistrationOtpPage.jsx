import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, MailCheck, RefreshCw, } from 'lucide-react';
import { Link, useLocation, useNavigate, } from 'react-router-dom';
import { authApi } from '../../services/api.js';

const OTP_LENGTH = 6;

function VerifyRegistrationOtpPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const email = location.state?.email || '';
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!email) {
            navigate('/register', { replace: true });
        }
    }, [email, navigate]);

    const otpValue = otp.join('');

    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1);

        setOtp((current) => {
            const nextOtp = [...current];
            nextOtp[index] = digit;
            return nextOtp;
        });

        if (errorMessage) {
            setErrorMessage('');
        }

        if (digit && index < OTP_LENGTH - 1) {
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

        if (event.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();

        const pastedValue = event.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH);

        if (!pastedValue) {
            return;
        }

        setOtp((current) => {
            const nextOtp = [...current];

            pastedValue.split('').forEach((digit, index) => {
                nextOtp[index] = digit;
            });

            return nextOtp;
        });

        inputRefs.current[
            Math.min(pastedValue.length, OTP_LENGTH) - 1
        ]?.focus();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (otpValue.length !== OTP_LENGTH) {
            setErrorMessage('Please enter the complete six-digit code.');
            return;
        }

        setIsSubmitting(true);

        try {
            await authApi.verifyRegistrationOtp({
                email,
                otp: otpValue,
            });

            navigate('/login', {
                replace: true,
                state: {
                message: 'Account verified successfully. You can now sign in.',
                email,
                },
            });
        } catch (error) {
            setErrorMessage(
                error.message || 'Unable to verify your account.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!email) {
        return null;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-margin py-space-xl text-on-surface md:px-margin-desktop">
            <section className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-space-lg text-center shadow-sm ring-1 ring-outline-variant/20 sm:p-space-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-secondary">
                    <MailCheck size={30} />
                </div>

                <p className="mt-space-lg text-label-sm font-label-md font-semibold uppercase tracking-wider text-secondary">
                    Email verification
                </p>

                <h1 className="mt-space-sm text-headline-lg font-headline-lg">
                    Verify your account
                </h1>

                <p className="mt-space-sm text-body-md text-on-surface-variant">
                    We sent a six-digit verification code to:
                </p>

                <p className="mt-space-xs break-all text-label-md font-label-md font-semibold text-on-surface">
                    {email}
                </p>

                {errorMessage && (
                    <div role="alert" className="mt-space-lg rounded-lg bg-error-container px-space-md py-space-sm text-left text-body-sm text-on-error-container" >
                        {errorMessage}
                    </div>
                )}

                <form className="mt-space-xl" onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-space-sm" onPaste={handlePaste} >
                        {otp.map((digit, index) => (
                            <input key={index} ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(event) =>
                                handleOtpChange(index, event.target.value)
                                }
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                aria-label={`Verification digit ${index + 1}`}
                                className="h-12 w-11 rounded-lg bg-surface-container-low text-center text-headline-md font-semibold text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary sm:h-14 sm:w-12"
                            />
                        ))}
                    </div>

                    <p className="mt-space-md text-body-sm text-on-surface-variant">
                        The code expires after five minutes.
                    </p>

                    <button type="submit" disabled={isSubmitting} className="mt-space-xl inline-flex h-11 w-full items-center justify-center gap-space-sm rounded-lg bg-secondary px-space-lg text-label-md font-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-secondary-container disabled:cursor-wait disabled:opacity-60" >
                        {isSubmitting ? (
                            <>
                                <RefreshCw size={17} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={17} />
                                Verify account
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-space-lg border-t border-outline-variant/30 pt-space-lg">
                    <Link to="/register" className="inline-flex items-center gap-space-xs text-label-md font-label-md font-semibold text-secondary hover:underline" >
                        <ArrowLeft size={15} />
                        Back to registration
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default VerifyRegistrationOtpPage;