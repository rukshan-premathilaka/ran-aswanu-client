import { Smartphone, WifiOff } from "lucide-react";
import SplitLayout from "./SplitLayout.jsx";
import SectionHeading from "./SectionHeading.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import PhoneMockup from "./PhoneMockup.jsx";

// Mobile app = Coming Soon. No download button and no APK link on purpose.
export default function MobileAppSection() {
    return (
        <section id="mobile-app" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SplitLayout
                    text={
                        <>
                            <SectionHeading
                                align="left"
                                badge="Coming Soon"
                                title="Ran Aswanu in your pocket"
                                description="A mobile experience for farmers is coming soon, designed to make farm management easier even in areas with limited internet connectivity."
                            />
                            <RevealOnScroll className="mt-8 flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50 p-5">
                                <span className="shrink-0 w-12 h-12 rounded-xl bg-white text-green-700 shadow-sm flex items-center justify-center">
                                    <WifiOff className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                                </span>
                                <p className="text-base sm:text-lg text-slate-700 leading-snug">Built for farmers, with offline-friendly data entry in mind.</p>
                            </RevealOnScroll>
                            <RevealOnScroll className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-amber-100 px-5 py-2.5 text-base font-semibold text-amber-800">
                                <Smartphone className="w-5 h-5" aria-hidden="true" /> Not available to download yet
                            </RevealOnScroll>
                        </>
                    }
                    visual={
                        <RevealOnScroll variant="image">
                            <PhoneMockup />
                        </RevealOnScroll>
                    }
                />
            </div>
        </section>
    );
}
