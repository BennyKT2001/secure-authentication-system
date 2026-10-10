import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo.jsx';

const navigationItems = [
  { label: 'Product', href: '#product' },
  { label: 'Security', href: '#security' },
  { label: 'Features', href: '#features' },
  { label: 'Resources', href: '#resources' },
];

function PublicNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/40 bg-surface/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-space-md px-margin md:px-margin-desktop">
                <Link to="/" onClick={closeMenu} aria-label="AssetGuard home">
                    <BrandLogo />
                </Link>

                <nav className="hidden items-center gap-space-xs md:flex" aria-label="Main navigation">
                    {navigationItems.map((item) => (
                        <a key={item.href} href={item.href} className="rounded-lg px-space-md py-space-xs text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface">
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-space-sm sm:flex">
                    <Link to="/login" className="inline-flex h-9 items-center justify-center rounded-lg px-space-md text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high">
                        Sign in
                    </Link>

                    <Link to="/register" className="inline-flex h-9 items-center justify-center rounded-lg bg-secondary px-space-md text-label-md font-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-container">
                        Create an account
                    </Link>
                </div>

                <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container md:hidden" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)} >
                    {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="border-t border-outline-variant/40 bg-surface px-margin py-space-md md:hidden">
                    <nav className="flex flex-col gap-space-xs" aria-label="Mobile navigation">
                        {navigationItems.map((item) => (
                            <a key={item.href} href={item.href} onClick={closeMenu}
                                className="rounded-lg px-space-md py-space-sm text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface" >
                                {item.label}
                            </a>
                        ))}

                        <div className="mt-space-sm flex flex-col gap-space-sm border-t border-outline-variant/40 pt-space-md">
                            <Link to="/login" onClick={closeMenu}
                                className="rounded-lg px-space-md py-space-sm text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high">
                                Sign in
                            </Link>

                            <Link to="/register" onClick={closeMenu} className="rounded-lg bg-secondary px-space-md py-space-sm text-center text-label-md font-label-md text-on-secondary hover:bg-secondary-container" >
                                Create an account
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default PublicNavbar;
