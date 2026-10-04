import { TrendingUp, Tag, Sprout, Brain, Route, ShieldAlert } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import FeatureCard from "./FeatureCard.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import VipInsightsCard from "./VipInsightsCard.jsx";
import PromoteFarmCard from "./PromoteFarmCard.jsx";

// Looks different from the real features on purpose (dashed cards + "Future" tag): these are not built yet.
const FUTURE = [
    { icon: TrendingUp, title: "Crop Yield Prediction", description: "Use historical and environmental data to estimate future crop yields." },
    { icon: Tag, title: "Price Prediction", description: "Analyze market trends and demand changes." },
    { icon: Sprout, title: "Crop Recommendations", description: "Suggest suitable crops based on environmental and soil conditions." },
    { icon: Brain, title: "AI Farming Advice", description: "Provide smart decision support for farmers." },
    { icon: Route, title: "Smart Delivery Optimization", description: "Suggest optimized shared delivery routes." },
    { icon: ShieldAlert, title: "Intelligent Trust Analysis", description: "Help identify suspicious transactions and improve marketplace reliability." },
];

export default function FutureSmartSection() {
    return (
        <section id="future" className="scroll-mt-20 bg-stone-50 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading badge="Future Development" title="Smarter farming is coming" description="These ideas are planned for the future. They are not part of the platform yet." />
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {FUTURE.map((f, i) => (
                        <RevealOnScroll key={f.title} delay={(i % 3) * 100} className="h-full">
                            <FeatureCard {...f} tone="future" badge="Future" />
                        </RevealOnScroll>
                    ))}
                </div>
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <VipInsightsCard />
                    <PromoteFarmCard />
                </div>
            </div>
        </section>
    );
}
