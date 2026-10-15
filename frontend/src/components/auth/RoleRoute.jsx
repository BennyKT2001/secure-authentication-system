import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

function RoleRoute({ allowedRoles }) {
    const { user } = useOutletContext();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        const destination =
        user.role === 'admin' ? '/dashboard' : '/my-assets';

        return <Navigate to={destination} replace />;
    }

    return <Outlet context={{ user }} />;
}

export default RoleRoute;