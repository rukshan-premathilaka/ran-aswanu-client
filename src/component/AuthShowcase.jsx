import React from "react";

/**
 * Left panel shown on the register/login pages.
 * Pure CSS + SVG, no external image requests, so it always loads.
 * Hidden on small screens (form takes over the full viewport there).
 */
function AuthShowcase() {
    return (
        <div className="relative hidden h-screen w-1/2 overflow-hidden bg-lime-600 lg:flex lg:flex-col lg:justify-between">
            {/* soft background texture */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-lime-300 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-800 blur-3xl" />
            </div>

            <div className="relative z-10 px-12 pt-12">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                            <path d="M12 3C9 6 7 9 7 12.5C7 15.5 9.2 18 12 18C14.8 18 17 15.5 17 12.5C17 9 15 6 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M12 18V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-white">Ranaswanu</span>
                </div>
            </div>

            {/* center illustration: simple crop field scene */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-10">
                <svg viewBox="0 0 360 300" className="w-full max-w-sm">
                    <ellipse cx="180" cy="255" rx="150" ry="18" fill="#3f6212" opacity="0.35" />
                    {[40, 90, 140, 190, 240, 290, 320].map((x, i) => (
                        <g key={x} transform={`translate(${x}, ${230 - (i % 2 === 0 ? 10 : 0)})`}>
                            <line x1="0" y1="0" x2="0" y2="-55" stroke="#ecfccb" strokeWidth="3" strokeLinecap="round" />
                            <path d="M0,-55 C-14,-48 -16,-30 -2,-24" fill="none" stroke="#ecfccb" strokeWidth="3" strokeLinecap="round" />
                            <path d="M0,-45 C14,-38 16,-22 2,-16" fill="none" stroke="#ecfccb" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="0" cy="-58" r="5" fill="#fef9c3" />
                        </g>
                    ))}
                    <path d="M20,238 Q180,205 340,238 L340,255 Q180,225 20,255 Z" fill="#4d7c0f" />
                </svg>
            </div>

            <div className="relative z-10 px-12 pb-12">
                <h2 className="max-w-sm text-2xl font-semibold leading-snug text-white">
                    Grow smarter, sell faster.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-lime-50/90">
                    Manage your crops, track your farm, and reach buyers directly
                    — all from one place built for Sri Lankan farmers.
                </p>
            </div>
        </div>
    );
}

export default AuthShowcase;
