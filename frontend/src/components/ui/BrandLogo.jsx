import { ShieldCheck } from 'lucide-react';

function BrandLogo({ compact = false, light = false }) {
    return (
        <div className="inline-flex items-center gap-space-sm" aria-label="AssetGuard">
            <span className={[
                'inline-flex h-9 w-9 items-center justify-center rounded-lg shadow-sm',
                light
                    ? 'bg-white text-primary-container'
                    : 'bg-primary-container text-white',
                ].join(' ')}
                aria-hidden="true"
            >
                <ShieldCheck size={20} strokeWidth={2.4} />
            </span>

            {/* Compact mode used to display on smaller screens */}
            {!compact && (
                <span className="flex flex-col leading-tight">
                <strong
                    className={[
                    'text-headline-sm font-headline-sm tracking-tight',
                    light ? 'text-white' : 'text-on-surface',
                    ].join(' ')}
                >
                    AssetGuard
                </strong>

                <small
                    className={[
                    'text-[10px] tracking-wide',
                    light ? 'text-white/70' : 'text-on-surface-variant',
                    ].join(' ')}
                >
                    Secure asset management
                </small>
                </span>
            )}
        </div>
    );
}

export default BrandLogo;
