import { ClipboardList, ShoppingBasket, Truck, ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import FeatureCard from "./FeatureCard.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";

const BENEFITS = [
    { number: "01", icon: ClipboardList, title: "Keep your farm organized", description: "Track crops, livestock, activities, expenses, and farming records." },
    { number: "02", icon: ShoppingBasket, title: "Reach buyers directly", description: "Create product listings and sell agricultural products directly." },
    { number: "03", icon: Truck, title: "Coordinate smarter deliveries", description: "Connect compatible transportation opportunities and help reduce delivery expenses." },
    { number: "04", icon: ShieldCheck, title: "Build confidence between users", description: "Ratings and reviews help improve trust and transparency." },
];

export default function BenefitsSection() {
    return (
        <section id="why" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading
                    eyebrow="Why Ran Aswanu?"
                    title="More than a marketplace. A farming ecosystem."
                    description="Farm management and the agricultural marketplace work together in one place, instead of being split across different systems."
                />
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {BENEFITS.map((b, i) => (
                        <RevealOnScroll key={b.number} delay={i * 100} className="h-full">
                            <FeatureCard {...b} />
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}
