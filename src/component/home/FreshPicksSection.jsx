import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { homeLog } from "./homeLog.js";
import SectionHeading from "./SectionHeading.jsx";
import ProductCard from "./ProductCard.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import { PrimaryButton } from "./Buttons.jsx";

const PICKS_PER_PAGE = 4;
const ROTATE_MS = 5000;

function SkeletonCard() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden animate-pulse" aria-hidden="true">
            <div className="aspect-[4/3] bg-slate-100" />
            <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 rounded bg-slate-100" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
                <div className="h-10 w-full rounded-full bg-slate-100" />
            </div>
        </div>
    );
}

// Real products only (from useProducts -> GET /products). Shows 4 at a time and rotates through the list,
// like before. Rotation pauses while the mouse is over the cards.
export default function FreshPicksSection({ products, isLoading, errorText, onSelect, onSeeAll }) {
    const [pickPage, setPickPage] = useState(0);
    const [pause, setPause] = useState(false);

    const pageCount = Math.max(1, Math.ceil(products.length / PICKS_PER_PAGE));
    const currentPage = pickPage % pageCount;

    useEffect(() => {
        if (pageCount <= 1 || pause) return undefined;
        const timer = setInterval(() => setPickPage((p) => (p + 1) % pageCount), ROTATE_MS);
        return () => clearInterval(timer);
    }, [pageCount, pause]);

    // Console log when products cannot be loaded (the user also sees the message on the page)
    useEffect(() => {
        if (errorText) homeLog.error("Fresh Picks: could not load products from GET /products.", errorText);
    }, [errorText]);

    // Wraps around, so the last page is full when there are at least 4 products
    const picks = Array.from({ length: Math.min(PICKS_PER_PAGE, products.length) }, (_, i) => products[(currentPage * PICKS_PER_PAGE + i) % products.length]);

    return (
        <section id="fresh-picks" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading eyebrow="Marketplace" title="Fresh Picks" description="Explore agricultural products currently listed by farmers." />

                <div className="mt-12">
                    {errorText && (
                        <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-base text-red-700">
                            {errorText}
                        </p>
                    )}
                    {!isLoading && !errorText && picks.length === 0 && (
                        <p className="text-center text-lg text-slate-600">No produce listed yet. Check back soon.</p>
                    )}

                    <div onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
                        {isLoading ? (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: PICKS_PER_PAGE }, (_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : (
                            <RevealOnScroll>
                                <div key={currentPage} className="picks-fade grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {picks.map((p, i) => (
                                        <ProductCard key={p.listId ?? p.id ?? i} product={p} onClick={() => onSelect(p)} />
                                    ))}
                                </div>
                            </RevealOnScroll>
                        )}
                    </div>

                    {pageCount > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: pageCount }, (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setPickPage(i)}
                                    aria-label={`Show picks ${i + 1}`}
                                    className={`h-2.5 rounded-full transition-all ${i === currentPage ? "w-7 bg-green-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-10 flex justify-center">
                        <PrimaryButton onClick={onSeeAll} icon={ArrowRight}>View All Products</PrimaryButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
