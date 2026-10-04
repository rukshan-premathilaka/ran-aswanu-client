import { useState } from "react";
import { Crown, LineChart } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll.jsx";

// VIP Smart Insights: shown as a coming-soon idea only. It must NOT claim to be an existing paid feature.
export default function VipInsightsCard() {
    const [open, setOpen] = useState(false);
    return (
        <RevealOnScroll className="h-full">
            <article className="h-full rounded-3xl bg-gradient-to-br from-slate-900 to-green-900 p-7 sm:p-8 text-white shadow-xl">
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3.5 py-1.5 text-sm font-bold text-slate-900">
                        <Crown className="w-4 h-4" aria-hidden="true" /> VIP
                    </span>
                    <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold">Coming Soon</span>
                </div>
                <div className="mt-6 flex items-center gap-3">
                    <LineChart className="w-8 h-8 text-green-300" strokeWidth={1.75} aria-hidden="true" />
                    <h3 className="text-2xl sm:text-3xl font-bold">Smart Insights</h3>
                </div>
                <p className="mt-3 text-lg text-green-50/90 leading-relaxed">Predict crop and market trends using advanced agricultural analytics.</p>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    className="btn-lift mt-6 rounded-full border-2 border-white/70 px-6 py-3 text-base font-semibold hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
                >
                    {open ? "Show Less" : "Learn More"}
                </button>
                {open && (
                    <p className="mt-4 rounded-2xl bg-white/10 p-4 text-base leading-relaxed text-green-50">
                        Smart Insights is a planned feature and is not available yet. We will share details here when it is ready.
                    </p>
                )}
            </article>
        </RevealOnScroll>
    );
}
