import { MessageCircle, Bell, Star, ClipboardList, Truck } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import FeatureCard from "./FeatureCard.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";

const FEATURES = [
    { icon: MessageCircle, title: "Real-time Communication", description: "Communicate with other platform users." },
    { icon: Bell, title: "Notifications", description: "Stay informed about relevant system activity." },
    { icon: Star, title: "Ratings & Reviews", description: "Improve trust and transparency between users." },
    { icon: ClipboardList, title: "Order Management", description: "Manage purchasing and selling activity." },
    { icon: Truck, title: "Delivery Coordination", description: "Coordinate transportation and shared deliveries." },
];

export default function MoreFeaturesSection() {
    return (
        <section id="more-features" className="scroll-mt-20 bg-green-50/70 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading eyebrow="More built-in features" title="Built to do more" />
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <RevealOnScroll key={f.title} delay={(i % 3) * 100} className="h-full">
                            <FeatureCard {...f} tone="soft" />
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}
