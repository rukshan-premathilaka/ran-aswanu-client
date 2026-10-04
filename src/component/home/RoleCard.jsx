import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

// One public user role (Farmer / Buyer / Transport Provider). Admin is never shown here.
// CTA: pass `ctaTo` (router link) or `onCta` (action).
export default function RoleCard({ icon: Icon, role, title, benefits, ctaLabel, ctaTo, onCta }) {
    const ctaClasses =
        "btn-lift mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-green-600 px-6 py-3.5 text-base font-semibold text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white group-hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300";
    const ctaContent = (
        <>
            {ctaLabel} <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </>
    );
    return (
        <article className="group lift h-full flex flex-col rounded-3xl bg-white border border-slate-200 p-7 shadow-sm hover:shadow-2xl hover:border-green-300">
            <div className="icon-pop w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-md">
                <Icon className="w-8 h-8" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-green-700">{role}</p>
            <h3 className="mt-1 text-2xl sm:text-[1.75rem] font-bold text-slate-900 leading-snug">{title}</h3>
            <ul className="mt-5 space-y-2.5 flex-1">
                {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-base sm:text-lg text-slate-700 leading-snug">
                        <Check className="w-5 h-5 mt-1 shrink-0 text-green-600" strokeWidth={2.5} aria-hidden="true" />
                        <span>{b}</span>
                    </li>
                ))}
            </ul>
            {ctaTo ? (
                <Link to={ctaTo} className={ctaClasses}>{ctaContent}</Link>
            ) : (
                <button type="button" onClick={onCta} className={ctaClasses}>{ctaContent}</button>
            )}
        </article>
    );
}
