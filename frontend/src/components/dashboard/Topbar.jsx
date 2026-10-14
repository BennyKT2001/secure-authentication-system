import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from 'lucide-react';

function Topbar({ onMenuClick, user }) {
    const displayName = user?.fullName || 'AssetGuard User';
    const displayRole = user?.role || 'employee';

    return (
        <header className="flex min-h-16 items-center justify-between gap-space-md border-b border-outline-variant/40 bg-surface/90 px-margin backdrop-blur-md md:px-margin-desktop">
            <button type="button" onClick={onMenuClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container md:hidden"
                aria-label="Open dashboard navigation"
            >
                <Menu size={20} />
            </button>

            <div className="relative hidden max-w-xl flex-1 md:block">
                {/* Search icon */}
                <Search size={18} className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />

                {/* Search input */}
                <input type="search" placeholder="Search assets by serial, name or employee..."
                className="h-10 w-full rounded-lg bg-surface-container-low pl-10 pr-space-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                aria-label="Search assets" />
            </div>

            <div className="flex items-center gap-space-sm">
                {/* Notifications */}
                <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                aria-label="View notifications">
                    <Bell size={19} />

                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-white">
                        3
                    </span>
                </button>

                <button type="button" className="hidden items-center gap-space-sm rounded-lg px-space-sm py-space-xs text-left hover:bg-surface-container sm:flex" aria-label="Open user menu" >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-semibold text-white">
                        {/* Initials */}
                        {displayName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>

                    <span className="hidden flex-col lg:flex">
                        <strong className="text-label-md font-label-md text-on-surface">
                            {displayName}
                        </strong>
                        <small className="text-body-sm capitalize text-on-surface-variant">
                            {displayRole}
                        </small>
                    </span>

                    <ChevronDown size={16} className="text-on-surface-variant" />
                </button>
            </div>
        </header>
    );
}

export default Topbar;