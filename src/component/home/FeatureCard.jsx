// Reusable card: line icon + heading + short text. Used for benefits, features, future ideas.
// tone: "default" (white card) | "soft" (tinted) | "future" (dashed, muted: not built yet)
export default function FeatureCard({ icon: Icon, title, description, number, tone = "default", badge, className = "" }) {
    const tones = {
        default: "bg-white border-slate-200 hover:border-green-300 hover:shadow-xl shadow-sm",
        soft: "bg-white/80 border-green-100 hover:border-green-300 hover:shadow-xl shadow-sm",
        future: "bg-white/70 border-dashed border-slate-300 hover:border-amber-400 hover:shadow-lg",
    };
    return (
        <article className={`group lift h-full rounded-3xl border p-6 sm:p-7 flex flex-col ${tones[tone]} ${className}`}>
            <div className="flex items-start justify-between">
                <div
                    className={`icon-pop w-14 h-14 rounded-2xl flex items-center justify-center ${
                        tone === "future" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
                    }`}
                >
                    {Icon && <Icon className="w-7 h-7" strokeWidth={1.75} aria-hidden="true" />}
                </div>
                {number && <span className="text-sm font-bold tracking-widest text-green-600/70">{number}</span>}
                {badge && (
                    <span className="rounded-full bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1">{badge}</span>
                )}
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900 leading-snug">{title}</h3>
            <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed">{description}</p>
        </article>
    );
}
