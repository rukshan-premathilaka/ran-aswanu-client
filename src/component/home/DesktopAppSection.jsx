import { Download, Maximize2, Keyboard, LayoutDashboard, CalendarCheck } from "lucide-react";
import { DESKTOP_APP_URL } from "./homeConfig.js";
import SplitLayout from "./SplitLayout.jsx";
import SectionHeading from "./SectionHeading.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import DesktopMockup from "./DesktopMockup.jsx";
import { PrimaryButton } from "./Buttons.jsx";

const BENEFITS = [
    { icon: Maximize2, label: "Larger workspace" },
    { icon: Keyboard, label: "Easy data entry" },
    { icon: LayoutDashboard, label: "Full application experience" },
    { icon: CalendarCheck, label: "Comfortable day-to-day management" },
];

// The desktop app already exists, so it is NOT marked "coming soon".
// The download button only appears when DESKTOP_APP_URL is configured (see homeConfig.js).
export default function DesktopAppSection() {
    return (
        <section id="desktop-app" className="scroll-mt-20 bg-stone-100 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SplitLayout
                    visualLeft
                    text={
                        <>
                            <SectionHeading
                                align="left"
                                eyebrow="Desktop App"
                                title="Ran Aswanu on your desktop"
                                description="Get a larger workspace for managing your farm, marketplace activities, and everyday Ran Aswanu tasks."
                            />
                            <ul className="mt-8 space-y-4">
                                {BENEFITS.map(({ icon: Icon, label }, i) => (
                                    <RevealOnScroll as="li" key={label} delay={i * 100} className="flex items-center gap-4">
                                        <span className="shrink-0 w-11 h-11 rounded-xl bg-white text-green-700 shadow-sm flex items-center justify-center">
                                            <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <span className="text-lg font-semibold text-slate-800">{label}</span>
                                    </RevealOnScroll>
                                ))}
                            </ul>
                        </>
                    }
                    visual={
                        <RevealOnScroll variant="image">
                            <DesktopMockup />
                        </RevealOnScroll>
                    }
                    cta={
                        DESKTOP_APP_URL ? (
                            <PrimaryButton href={DESKTOP_APP_URL} icon={Download} target="_blank" rel="noopener noreferrer">
                                Download Desktop App
                            </PrimaryButton>
                        ) : null
                    }
                />
            </div>
        </section>
    );
}
