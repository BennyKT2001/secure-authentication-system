import { ArrowRight, CheckCircle2, Eye, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import PublicNavbar from '../../components/layout/PublicNavbar.jsx';

const previewAssets = [
    {
        name: 'MacBook Pro 16" M3 Max',
        serial: 'SN-MBP-8921',
        status: 'Assigned',
        statusClass: 'bg-secondary-fixed text-on-secondary-fixed',
    },
    {
        name: 'Dell UltraSharp 32" 4K',
        serial: 'SN-DEL-4019',
        status: 'Available',
        statusClass: 'bg-surface-container text-on-tertiary-container',
    },
    {
        name: 'ThinkPad X1 Carbon Gen 11',
        serial: 'SN-THK-1104',
        status: 'Maintenance',
        statusClass: 'bg-error-container text-on-error-container',
    },
];

const trustItems = [
    {
        icon: LockKeyhole,
        title: 'Secure authentication',
        text: 'Verified access for every authorised team member.',
    },
    {
        icon: UsersRound,
        title: 'Role-based access control',
        text: 'Give administrators and employees the right access.',
    },
    {
        icon: Eye,
        title: 'Real-time asset visibility',
        text: 'Know what is available, assigned or under maintenance.',
    },
    {
        icon: ShieldCheck,
        title: 'Built for growing teams',
        text: 'A reliable foundation for secure business operations.',
    },
];

function LandingPage() {
    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <PublicNavbar />

            <main className="pt-16">
                <section className="relative overflow-hidden bg-surface py-space-2xl lg:py-32">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary-fixed/30 blur-3xl" />

                    <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-surface-container-high/60 blur-3xl" />

                    <div className="relative mx-auto grid max-w-[1600px] items-center gap-space-2xl px-margin md:px-margin-desktop lg:grid-cols-2">
                        <div className="max-w-2xl">
                            <div className="mb-space-lg inline-flex items-center gap-space-sm rounded-full bg-surface-container-high px-space-md py-space-xs text-label-sm font-label-md uppercase tracking-wider text-on-surface">
                                <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                                </span>
                                Secure asset governance for growing teams
                            </div>

                            <h1 className="max-w-xl text-display-lg font-display-lg leading-tight tracking-tight text-on-surface sm:text-5xl">
                                Know every asset.
                                Control every access.
                            </h1>

                            <p className="mt-space-lg max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
                                AssetGuard gives growing businesses a secure, reliable way to
                                track company assets, manage responsibility and protect access
                                from one place.
                            </p>

                            <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
                                <Link to="/register" className="group inline-flex h-11 items-center justify-center gap-space-sm rounded-lg bg-secondary px-space-lg text-label-md font-label-md text-on-secondary shadow-md transition-all hover:bg-secondary-container hover:shadow-lg" >
                                    Create your account

                                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>

                                <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-lg bg-surface-container-lowest px-space-lg text-label-md font-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container">
                                    Sign in
                                </Link>
                            </div>

                            <div className="mt-space-lg flex flex-wrap gap-x-space-lg gap-y-space-sm text-label-md text-on-surface-variant">
                                <span className="inline-flex items-center gap-space-xs">
                                    <CheckCircle2 size={16} className="text-secondary" />
                                    Secure access
                                </span>
                                <span className="inline-flex items-center gap-space-xs">
                                    <CheckCircle2 size={16} className="text-secondary" />
                                    Clear ownership
                                </span>
                                <span className="inline-flex items-center gap-space-xs">
                                    <CheckCircle2 size={16} className="text-secondary" />
                                    Complete visibility
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -right-2 -top-4 z-10 hidden rounded-lg bg-surface-container-lowest px-space-md py-space-sm text-code-sm text-on-surface shadow-lg sm:flex sm:items-center sm:gap-space-sm">
                                <span className="h-2 w-2 rounded-full bg-on-tertiary-container" />
                                Live asset visibility
                            </div>

                            <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl ring-1 ring-outline-variant/30">
                                <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-md">
                                    <div className="flex items-center gap-space-sm">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container text-white">
                                            <ShieldCheck size={15} />
                                        </span>

                                        <div>
                                            <p className="text-label-md font-label-md font-semibold text-on-surface">
                                                AssetGuard Console
                                            </p>
                                            <p className="text-code-sm text-on-surface-variant">
                                                Secure workspace
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-surface px-space-sm py-space-xs text-code-sm text-on-tertiary-container">
                                        128 assets active
                                    </span>
                                </div>

                                <div className="space-y-space-md p-space-md">
                                    <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-4">
                                        {[
                                        ['Total assets', '128', 'text-on-surface'],
                                        ['Available', '74', 'text-on-tertiary-container'],
                                        ['Assigned', '42', 'text-secondary'],
                                        ['Maintenance', '12', 'text-error'],
                                        ].map(([label, value, valueClass]) => (
                                            <div key={label} className="rounded-lg bg-surface-container-low p-space-sm" >
                                                <p className="text-label-sm uppercase text-on-surface-variant">
                                                    {label}
                                                </p>
                                                <p className={`mt-space-xs text-headline-md font-headline-md ${valueClass}`} >
                                                    {value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="overflow-hidden rounded-lg bg-surface-container-low/60">
                                        <div className="grid grid-cols-12 bg-surface-container-high px-space-md py-space-sm text-label-sm text-on-surface-variant">
                                            <span className="col-span-6">Asset</span>
                                            <span className="col-span-3">Serial</span>
                                            <span className="col-span-3 text-right">Status</span>
                                        </div>

                                        {previewAssets.map((asset) => (
                                            <div key={asset.serial} className="grid grid-cols-12 items-center gap-space-sm border-t border-outline-variant/20 px-space-md py-space-md" >
                                                <span className="col-span-6 truncate text-label-md font-label-md text-on-surface">
                                                    {asset.name}
                                                </span>
                                                <span className="col-span-3 truncate font-code-sm text-on-surface-variant">
                                                    {asset.serial}
                                                </span>
                                                <span className="col-span-3 flex justify-end">
                                                    <span className={`rounded-full px-space-sm py-space-xs text-[10px] font-label-md ${asset.statusClass}`} >
                                                        {asset.status}
                                                    </span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-outline-variant/30 bg-surface-container-low px-margin py-space-lg md:px-margin-desktop">
                    <div className="mx-auto grid max-w-[1600px] gap-space-lg md:grid-cols-2 lg:grid-cols-4">
                        {trustItems.map(({ icon: Icon, title, text }) => (
                            <div key={title} className="flex gap-space-sm">
                                <Icon className="mt-0.5 shrink-0 text-secondary" size={18} />
                                <div>
                                <h2 className="text-label-md font-label-md font-semibold text-on-surface">
                                    {title}
                                </h2>
                                <p className="mt-space-xs text-body-sm leading-relaxed text-on-surface-variant">
                                    {text}
                                </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}

export default LandingPage;