import { Megaphone, Leaf } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll.jsx";

// Advertisement idea: a future / optional capability, not an active paid service.
export default function PromoteFarmCard() {
    return (
        <RevealOnScroll className="h-full" delay={100}>
            <article className="h-full rounded-3xl border border-dashed border-slate-300 bg-white p-7 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Megaphone className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-semibold text-amber-800">Coming Soon</span>
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl font-bold text-slate-900">Promote your farm</h3>
                <p className="mt-3 text-lg text-slate-600 leading-relaxed">
                    Give selected products and farm listings greater visibility to reach more potential buyers.
                </p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-label="Example of a promoted listing">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Example preview</p>
                    <div className="mt-3 flex items-center gap-4">
                        <span className="shrink-0 w-14 h-14 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                            <Leaf className="w-7 h-7" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-lg font-semibold text-slate-900 leading-tight">Fresh Tomatoes</p>
                            <p className="text-base text-slate-600">Available from local farmer</p>
                        </div>
                        <span className="ml-auto rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">Promoted</span>
                    </div>
                </div>
            </article>
        </RevealOnScroll>
    );
}
