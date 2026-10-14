import { useState } from 'react';
import { X } from 'lucide-react';
import { Outlet, useOutletContext } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

function DashboardLayout() {
    const { user } = useOutletContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-background text-on-surface">

            {/* Sidebar overlay */}
            <div
                className={[
                'fixed inset-0 z-40 bg-primary-container/40 transition-opacity md:hidden',
                isSidebarOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
                ].join(' ')}
                aria-hidden={!isSidebarOpen}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <aside className={[ 'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200',
                'md:translate-x-0',
                isSidebarOpen
                ? 'translate-x-0'
                : 'max-md:-translate-x-full',
                ].join(' ')} aria-label="Dashboard sidebar" >
                <div className="relative h-full">
                    <button type="button" onClick={closeSidebar} className="absolute right-space-md top-space-md inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container md:hidden" aria-label="Close dashboard navigation" >
                        <X size={19} />
                    </button>

                    <Sidebar onNavigate={closeSidebar} />
                </div>
            </aside>

            <div className="md:pl-72">
                {/* Topbar */}
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} user={user} />

                {/* Main content */}
                <main className="min-h-[calc(100vh-4rem)] p-margin md:p-margin-desktop">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;