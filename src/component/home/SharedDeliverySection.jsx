import { Truck, MapPin, Wallet, Users, BellRing, Sprout } from "lucide-react";
import SplitLayout from "./SplitLayout.jsx";
import SectionHeading from "./SectionHeading.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";

const BENEFITS = [
    { icon: Users, label: "Shared transport" },
    { icon: Wallet, label: "Lower transportation cost" },
    { icon: Truck, label: "Delivery coordination" },
    { icon: BellRing, label: "Status updates" },
];

function FarmerNode({ name }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white border border-green-100 shadow-sm px-4 py-3.5">
            <span className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <Sprout className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold text-slate-800">{name}</span>
        </div>
    );
}

// Route graphic drawn with CSS + SVG lines (no photo needed): Farmer A + Farmer B -> Shared Delivery -> Destination
function RouteGraphic() {
    return (
        <div
            className="rounded-[2rem] bg-gradient-to-br from-green-100 via-green-50 to-white border border-green-100 p-6 sm:p-8 shadow-xl"
            role="img"
            aria-label="Two farmers share one delivery trip to the same destination"
        >
            <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-4">
                    <FarmerNode name="Farmer A" />
                    <FarmerNode name="Farmer B" />
                </div>

                <div className="flex md:flex-col items-center justify-center gap-2 py-2">
                    <svg viewBox="0 0 60 120" className="hidden md:block w-14 h-28 text-green-600" aria-hidden="true">
                        <path className="route-line" d="M0 20 C30 20 30 60 56 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path className="route-line" d="M0 100 C30 100 30 60 56 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="flex items-center gap-2 rounded-full bg-green-600 text-white px-4 py-2.5 shadow-lg">
                        <Truck className="w-5 h-5" aria-hidden="true" />
                        <span className="text-base font-semibold whitespace-nowrap">Shared Delivery</span>
                    </div>
                    <svg viewBox="0 0 60 8" className="hidden md:block w-14 h-2 text-green-600" aria-hidden="true">
                        <path className="route-line" d="M0 4 H60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <svg viewBox="0 0 8 40" className="md:hidden w-2 h-10 text-green-600" aria-hidden="true">
                        <path className="route-line" d="M4 0 V40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-900 text-white shadow-lg px-4 py-5">
                    <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                        <MapPin className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-lg font-semibold">Destination</span>
                </div>
            </div>
        </div>
    );
}

export default function SharedDeliverySection() {
    return (
        <section id="shared-delivery" className="scroll-mt-20 bg-green-50/70 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SplitLayout
                    visualLeft
                    text={
                        <>
                            <SectionHeading
                                align="left"
                                eyebrow="Shared Delivery"
                                title="Deliver together. Spend less."
                                description="Connect compatible transportation requests and coordinate shared delivery trips for similar destinations."
                            />
                            <ul className="mt-8 grid sm:grid-cols-2 gap-4">
                                {BENEFITS.map(({ icon: Icon, label }, i) => (
                                    <RevealOnScroll as="li" key={label} delay={i * 100} className="flex items-center gap-3.5 rounded-2xl bg-white border border-green-100 px-4 py-3.5 shadow-sm">
                                        <span className="shrink-0 w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                                            <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <span className="text-lg font-semibold text-slate-800 leading-snug">{label}</span>
                                    </RevealOnScroll>
                                ))}
                            </ul>
                        </>
                    }
                    visual={
                        <RevealOnScroll variant="image">
                            <RouteGraphic />
                        </RevealOnScroll>
                    }
                />
            </div>
        </section>
    );
}
