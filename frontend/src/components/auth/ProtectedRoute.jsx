import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api.js';

function ProtectedRoute() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
        try {
            const response = await authApi.getCurrentUser();

            if (isMounted) {
            setUser(response.data);
            }
        } catch {
            if (isMounted) {
            setUser(null);
            }
        } finally {
            if (isMounted) {
            setIsCheckingSession(false);
            }
        }
        };

        checkSession();

        return () => {
        isMounted = false;
        };
    }, []);

    if (isCheckingSession) {
        return (
        <main className="flex min-h-screen items-center justify-center bg-background px-margin">
            <div className="rounded-xl bg-surface-container-lowest px-space-xl py-space-lg text-center shadow-md">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />

                <p className="mt-space-md text-body-md text-on-surface-variant">
                    Verifying your secure session...
                </p>
            </div>
        </main>
        );
    }

    if (!user) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
        );
    }

    return <Outlet context={{ user }} />;
}

export default ProtectedRoute;