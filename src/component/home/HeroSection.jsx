import { Sprout, Store, Truck, WifiOff, ArrowRight, ChevronDown, Users } from "lucide-react";
import { HOME_IMAGES } from "./homeConfig.js";
import { scrollToId } from "./homeUtils.js";
import { PrimaryButton, SecondaryButton } from "./Buttons.jsx";
import ImageWithFallback from "./ImageWithFallback.jsx";

const BENEFITS = [
    { icon: Sprout, title: "Manage Your Farm", text: "Track crops, livestock, activities and expenses." },
    { icon: Store, title: "Sell Direct", text: "Connect your harvest with buyers." },
    { icon: Truck, title: "Shared Delivery", text: "Coordinate transportation and reduce delivery costs." },
    { icon: WifiOff, title: "Offline-Friendly Farming", text: "Continue farm data work in low-connectivity areas." },
];

const FLOATING_CARDS = [
    { icon: Store, title: "Direct Marketplace", text: "Connect farmers and buyers", pos: "lg:-left-6 lg:top-8", delay: 1100 },
    { icon: Users, title: "Shared Delivery", text: "Coordinate compatible deliveries", pos: "lg:-right-4 lg:top-1/2", delay: 1250 },
    { icon: Sprout, title: "Farm Management", text: "Manage farming activities", pos: "lg:left-8 lg:-bottom-6", delay: 1400 },
];

// Staged entrance: eyebrow -> H1 -> text -> buttons -> benefits -> image -> floating cards (see home.css, .stage)
export default function HeroSection({ onOpenProducts }) {
    const stage = (ms) => ({ "--d": `${ms}ms` });
    const image = HOME_IMAGES.hero;

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-green-50/70 via-white to-white" aria-labelledby="hero-title">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8 pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-24 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
                <div>
                    <p className="stage flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-green-700 mb-5" style={stage(150)}>
                        <span className="w-2 h-2 rounded-full bg-green-600" /> Farm to table, direct from Sri Lanka
                    </p>
                    <h1
                        id="hero-title"
                        className="stage text-[2.5rem] sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.08] text-slate-900"
                        style={stage(300)}
                    >
                        Grow smarter. <span className="text-green-600">Sell direct.</span> Connect better.
                    </h1>
                    <p className="stage mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-slate-600" style={stage(450)}>
                        Ran Aswanu brings farm management, direct crop selling, trusted users, and shared delivery into one platform built
                        for Sri Lankan agriculture.
                    </p>
                    <div className="stage mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4" style={stage(600)}>
                        <PrimaryButton onClick={onOpenProducts} icon={ArrowRight}>Explore Marketplace</PrimaryButton>
                        <SecondaryButton onClick={() => scrollToId("how-it-works")} icon={ChevronDown}>How It Works</SecondaryButton>
                    </div>

                    <ul className="stage mt-10 grid sm:grid-cols-2 gap-x-6 gap-y-5" style={stage(750)}>
                        {BENEFITS.map(({ icon: Icon, title, text }) => (
                            <li key={title} className="flex items-start gap-3.5">
                                <span className="shrink-0 w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                                    <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900 leading-tight">{title}</p>
                                    <p className="mt-1 text-base text-slate-600 leading-snug">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    <div className="stage-image stage relative h-72 sm:h-96 lg:h-[34rem]" style={stage(900)}>
                        <div className="absolute inset-0 bg-green-300/50 rounded-[2rem] blur-2xl" aria-hidden="true" />
                        <div className="group relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/70">
                            <ImageWithFallback
                                src={image.src}
                                fallback={image.fallback}
                                alt={image.alt}
                                eager
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Floating cards: overlay the photo on large screens, a tidy row below it on small screens */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:block">
                        {FLOATING_CARDS.map(({ icon: Icon, title, text, pos, delay }) => (
                            <div
                                key={title}
                                className={`stage lg:absolute ${pos} rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 px-4 py-3.5 flex items-center gap-3 lg:max-w-[16rem]`}
                                style={stage(delay)}
                            >
                                <span className="shrink-0 w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                                    <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-base font-semibold text-slate-900 leading-tight">{title}</p>
                                    <p className="text-sm text-slate-600 leading-snug mt-0.5">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
