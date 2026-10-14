import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Settings2,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo.jsx';

const navigationGroups = [
    {
        label: 'Administration',
        items: [
        {
            label: 'Dashboard',
            to: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            label: 'Assets inventory',
            to: '/assets',
            icon: Boxes,
        },
        {
            label: 'User management',
            to: '/users',
            icon: UsersRound,
        },
        ],
    },
    {
        label: 'Employee view',
        items: [
        {
            label: 'My assigned assets',
            to: '/my-assets',
            icon: UserRound,
        },
        ],
    },
    {
        label: 'System',
        items: [
        {
            label: 'Settings & security',
            to: '/settings',
            icon: Settings2,
        },
        {
            label: 'Profile',
            to: '/profile',
            icon: UserRound,
        },
        ],
    },
];

function Sidebar({ onNavigate, onLogout }) {
    return (
        <aside className="flex h-full w-full flex-col bg-surface-container-lowest px-space-md py-space-lg">
            <div className="px-space-sm">
                <BrandLogo />
            </div>

            <nav className="mt-space-xl flex-1 space-y-space-lg" aria-label="Dashboard navigation">
                {navigationGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-space-sm text-label-sm font-label-md uppercase tracking-wider text-on-surface-variant">
                            {group.label}
                        </p>

                        <div className="mt-space-sm space-y-space-xs">
                            {group.items.map(({ label, to, icon: Icon }) => (
                                <NavLink key={to} to={to}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    [
                                    'flex items-center gap-space-sm rounded-lg px-space-sm py-space-sm text-label-md font-label-md transition-colors',
                                    isActive
                                        ? 'bg-primary-fixed text-secondary'
                                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                                    ].join(' ')
                                }
                                >
                                    <Icon size={18} strokeWidth={1.9} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="rounded-xl bg-primary-container p-space-md text-on-primary">
                <div className="flex items-center gap-space-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-on-secondary">
                        <ShieldCheck size={17} />
                    </span>

                    <div>
                        <p className="text-label-md font-label-md font-semibold">
                            Secure workspace
                        </p>
                        <p className="mt-0.5 text-body-sm text-on-primary-container">
                            Protected asset operations
                        </p>
                    </div>
                </div>

                <button type="button" className="mt-space-md inline-flex items-center gap-space-xs text-label-sm font-label-md text-secondary-fixed hover:underline" onClick={onLogout} >
                    <LogOut size={15} />
                    Sign out
                </button>
            </div>
        </aside>
    );
    }

export default Sidebar;
