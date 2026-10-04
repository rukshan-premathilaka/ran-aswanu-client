import { UserPlus, LogIn, Handshake } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import RevealOnScroll from "./RevealOnScroll.jsx";
import { PrimaryButton } from "./Buttons.jsx";

const STEPS = [
    { number: "01", icon: UserPlus, title: "Register", text: "Create your Ran Aswanu account." },
    { number: "02", icon: LogIn, title: "Login", text: "Access your account and continue to your platform experience." },
    { number: "03", icon: Handshake, title: "Connect & Grow", text: "Choose how you want to use Ran Aswanu and start buying, selling, managing, or transporting." },
];

// Progress line: horizontal on large screens, vertical on small screens
export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <SectionHeading eyebrow="How it works" title="Start using Ran Aswanu in 3 simple steps" />

                <ol className="relative mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
                    <div className="hidden lg:block absolute top-8 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-green-200 via-green-500 to-green-200" aria-hidden="true" />
                    <div className="lg:hidden absolute top-8 bottom-8 left-8 w-0.5 bg-gradient-to-b from-green-200 via-green-500 to-green-200" aria-hidden="true" />
                    {STEPS.map(({ number, icon: Icon, title, text }, i) => (
                        <RevealOnScroll as="li" key={number} delay={i * 150} className="relative flex lg:flex-col lg:items-center lg:text-center gap-5 lg:gap-0">
                            <div className="relative z-10 shrink-0 w-16 h-16 rounded-full bg-green-600 text-white shadow-lg ring-8 ring-white flex items-center justify-center">
                                <Icon className="w-7 h-7" strokeWidth={1.75} aria-hidden="true" />
                            </div>
                            <div className="lg:mt-6">
                                <p className="text-sm font-bold tracking-widest text-green-600">STEP {number}</p>
                                <h3 className="mt-1 text-2xl font-bold text-slate-900">{title}</h3>
                                <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed lg:max-w-xs">{text}</p>
                            </div>
                        </RevealOnScroll>
                    ))}
                </ol>

                <RevealOnScroll className="mt-12 flex justify-center">
                    <PrimaryButton to="/register">Create Your Account</PrimaryButton>
                </RevealOnScroll>
            </div>
        </section>
    );
}
