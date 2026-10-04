import { ClipboardList, Store, BarChart3, Tractor } from "lucide-react";
import { HOME_IMAGES } from "./homeConfig.js";
import SplitLayout from "./SplitLayout.jsx";
import SectionHeading from "./SectionHeading.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import ImageWithFallback from "./ImageWithFallback.jsx";
import { PrimaryButton } from "./Buttons.jsx";

const POINTS = [
    { icon: ClipboardList, title: "Farm Records", text: "Keep farming information organized." },
    { icon: Store, title: "Sell Your Harvest", text: "Publish products for buyers." },
    { icon: BarChart3, title: "Track Performance", text: "Use reports and analytics to understand your farm." },
];

export default function BecomeFarmerSection() {
    const image = HOME_IMAGES.becomeFarmer;
    return (
        <section id="become-farmer" className="scroll-mt-20 bg-stone-50 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SplitLayout
                    text={
                        <>
                            <SectionHeading
                                align="left"
                                eyebrow="Become a Farmer"
                                title="Ready to manage your farm digitally?"
                                description="Turn your account into a farmer workspace and manage crops, livestock, farming activities, expenses, and product listings from one place."
                            />
                            <ul className="mt-8 space-y-5">
                                {POINTS.map(({ icon: Icon, title, text }, i) => (
                                    <RevealOnScroll as="li" key={title} delay={i * 100} className="flex items-start gap-4">
                                        <span className="shrink-0 w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                                            <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <p className="text-xl font-semibold text-slate-900">{title}</p>
                                            <p className="text-base sm:text-lg text-slate-600 leading-snug">{text}</p>
                                        </div>
                                    </RevealOnScroll>
                                ))}
                            </ul>
                        </>
                    }
                    visual={
                        <RevealOnScroll variant="image">
                            <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
                                <ImageWithFallback src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                                    <Tractor className="w-5 h-5 text-green-700" aria-hidden="true" />
                                    <span className="text-base font-semibold text-slate-800">Your farm workspace</span>
                                </div>
                            </div>
                        </RevealOnScroll>
                    }
                    cta={<PrimaryButton to="/register">Become a Farmer</PrimaryButton>}
                />
            </div>
        </section>
    );
}
