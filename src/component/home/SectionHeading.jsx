import RevealOnScroll from "./RevealOnScroll.jsx";

// Section title block. Mobile H2 = 32px, desktop H2 = 48px, body = 18-20px.
export default function SectionHeading({ eyebrow, title, description, badge, align = "center", light = false, className = "" }) {
    const center = align === "center";
    return (
        <RevealOnScroll className={`${center ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
            {eyebrow && (
                <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${light ? "text-green-300" : "text-green-700"}`}>
                    {eyebrow}
                </p>
            )}
            {badge && (
                <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-sm font-semibold px-3.5 py-1 mb-4">
                    {badge}
                </span>
            )}
            <h2 className={`text-[2rem] sm:text-[2.5rem] lg:text-5xl font-bold tracking-tight leading-[1.15] ${light ? "text-white" : "text-slate-900"}`}>
                {title}
            </h2>
            {description && (
                <p className={`mt-4 text-lg lg:text-xl leading-relaxed ${light ? "text-green-50/90" : "text-slate-600"}`}>{description}</p>
            )}
        </RevealOnScroll>
    );
}
