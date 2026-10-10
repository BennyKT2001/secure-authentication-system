import { Code2, ShieldCheck } from 'lucide-react';
// import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo.jsx';

const footerGroups = [
    {
        title: 'Product',
        links: [
            { label: 'Dashboard', href: '#product' },
            { label: 'Asset inventory', href: '#product' },
            { label: 'Security', href: '#security' },
            { label: 'Features', href: '#features' },
        ],
    },

    {
        title: 'Company',
        links: [
            { label: 'About', href: '#resources' },
            { label: 'Contact', href: '#resources' },
            { label: 'Resources', href: '#resources' },
            { label: 'Help centre', href: '#resources' },
        ],
    },

    {
        title: 'Legal',
        links: [
            { label: 'Privacy policy', href: '#resources' },
            { label: 'Terms of use', href: '#resources' },
            { label: 'Cookie policy', href: '#resources' },
        ],
    },

];

const socialLinks = [
    { label: 'LinkedIn', icon: Code2, href: 'https://www.linkedin.com' },
    { label: 'GitHub', icon: Code2, href: 'https://github.com' },
    { label: 'X / Twitter', icon: Code2, href: 'https://x.com' },
    { label: 'Instagram', icon: Code2, href: 'https://www.instagram.com' },
];

function PublicFooter( ) {
    return (
        <footer className="border-t border-outline-variant/40 bg-surface-container-low px-margin py-space-2xl md:px-margin-desktop">
            <div className="mx-auto max-w-[1600px]">
                <div className="grid gap-space-2xl lg:grid-cols-[1.5fr_repeat(3,1fr)]">
                    <div className="max-w-sm">
                        <BrandLogo />
                        <p className="mt-space-md text-body-md leading-relaxed text-on-surface-variant">
                            Secure, reliable asset management for growing teams that need
                            clear ownership and complete visibility.
                        </p>

                        {/* Social links */}
                        <div className="mt-space-lg flex items-center gap-space-sm">
                            {socialLinks.map(({ label, icon: Icon, href }) => (
                                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/60 text-on-surface-variant transition-colorshover:border-secondary hover:bg-secondary/10 hover:text-secondary" >
                                    <Icon size={17} strokeWidth={1.8} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerGroups.map((group) => (
                        <div key={group.title}>
                            <h2 className="text-label-md font-label-md font-semibold text-on-surface">
                                {group.title}
                            </h2>

                            <ul className="mt-space-md space-y-space-sm">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-body-md text-on-surface-variant transition-colors hover:text-secondary" >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-space-2xl flex flex-col gap-space-sm border-t border-outline-variant/40 pt-space-lg text-body-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 AssetGuard. All rights reserved.</p>

                    <div className="inline-flex items-center gap-space-sm">
                        <ShieldCheck size={15} className="text-on-tertiary-container" />
                        <span>Secure by design</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default PublicFooter;
