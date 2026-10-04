import { Download } from "lucide-react";
import { DESKTOP_APP_URL, HOME_IMAGES } from "./homeConfig.js";
import RevealOnScroll from "./RevealOnScroll.jsx";
import ImageWithFallback from "./ImageWithFallback.jsx";
import { PrimaryButton, SecondaryButton } from "./Buttons.jsx";

export default function FinalCTASection({ onOpenProducts }) {
    const image = HOME_IMAGES.finalCta;
    return (
        <section id="get-started" className="relative isolate overflow-hidden bg-green-900 py-20 sm:py-24 lg:py-28">
            <div className="absolute inset-0 -z-10 opacity-25" aria-hidden="true">
                <ImageWithFallback src={image.src} alt="" className="w-full h-full object-cover" placeholderClassName="bg-green-900" />
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-900/80 via-green-900/70 to-slate-900/90" aria-hidden="true" />

            <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
                <RevealOnScroll>
                    <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                        Ready to connect with Sri Lankan agriculture?
                    </h2>
                    <p className="mt-5 text-lg lg:text-xl leading-relaxed text-green-50/90">
                        Buy smarter. Sell directly. Manage better. Grow together with Ran Aswanu.
                    </p>
                </RevealOnScroll>
                <RevealOnScroll delay={150} className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                    <PrimaryButton onDark onClick={onOpenProducts}>Explore Products</PrimaryButton>
                    <SecondaryButton onDark to="/register">Create Account</SecondaryButton>
                    {DESKTOP_APP_URL && (
                        <SecondaryButton onDark href={DESKTOP_APP_URL} icon={Download} target="_blank" rel="noopener noreferrer">
                            Download Desktop App
                        </SecondaryButton>
                    )}
                </RevealOnScroll>
            </div>
        </section>
    );
}
