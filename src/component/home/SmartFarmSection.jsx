import { Sprout, Map as MapIcon, PawPrint, Wallet, CalendarDays, CloudSun, BarChart3, WifiOff } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import DashboardMockup from "./DashboardMockup.jsx";

const FEATURES = [
    { icon: Sprout, title: "Crop Management", text: "Track crops, harvesting, and farming records." },
    { icon: MapIcon, title: "Field Management", text: "Organize and monitor your farm plots." },
    { icon: PawPrint, title: "Livestock", text: "Maintain livestock-related records." },
    { icon: Wallet, title: "Expense Tracking", text: "Record and understand farm expenses." },
    { icon: CalendarDays, title: "Calendar", text: "Plan farming tasks and important activities." },
    { icon: CloudSun, title: "Weather", text: "Access weather information for farm decisions." },
    { icon: BarChart3, title: "Reports & Analytics", text: "Understand productivity and farm performance." },
    { icon: WifiOff, title: "Offline Support", text: "Continue farm data entry when internet connectivity is limited." },
];

// "Features" in the header scrolls here (id="features").
export default function SmartFarmSection() {
    return (
        <section id="features" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading eyebrow="Smart Farm Management" title="Everything you need to manage the farm" />
                <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                    <RevealOnScroll variant="image">
                        <div className="rounded-[2rem] bg-gradient-to-br from-green-100 to-green-50 p-4 sm:p-6 shadow-xl">
                            <DashboardMockup className="shadow-lg" />
                        </div>
                    </RevealOnScroll>
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {FEATURES.map(({ icon: Icon, title, text }, i) => (
                            <RevealOnScroll as="li" key={title} delay={(i % 2) * 100 + Math.floor(i / 2) * 80} className="h-full">
                                <div className="group lift h-full flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-green-300 hover:shadow-lg">
                                    <span className="icon-pop shrink-0 w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                                        <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 leading-snug">{title}</h3>
                                        <p className="mt-1 text-base text-slate-600 leading-snug">{text}</p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
