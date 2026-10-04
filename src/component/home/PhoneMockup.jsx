import { Sprout, CloudSun, Wallet, CalendarDays } from "lucide-react";
import { HOME_IMAGES } from "./homeConfig.js";
import ImageWithFallback from "./ImageWithFallback.jsx";

const ROWS = [
    { icon: Sprout, label: "My Crops" },
    { icon: CalendarDays, label: "Calendar" },
    { icon: Wallet, label: "Expenses" },
    { icon: CloudSun, label: "Weather" },
];

// Phone frame. Shows HOME_IMAGES.mobileScreenshot when set, otherwise a drawn app screen.
export default function PhoneMockup() {
    const shot = HOME_IMAGES.mobileScreenshot;
    return (
        <div className="mx-auto w-64 sm:w-72 rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl ring-1 ring-black/10" role="img" aria-label="Preview of the upcoming Ran Aswanu mobile app">
            <div className="relative overflow-hidden rounded-[2rem] bg-white aspect-[9/18]">
                <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900" aria-hidden="true" />
                {shot ? (
                    <ImageWithFallback src={shot} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="h-full bg-gradient-to-b from-green-600 to-green-500 pt-12" aria-hidden="true">
                        <p className="px-5 text-lg font-bold text-white">Ran Aswanu</p>
                        <div className="mt-4 h-full rounded-t-3xl bg-white p-4 space-y-3">
                            {ROWS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-3 rounded-2xl bg-green-50 px-3 py-3">
                                    <span className="w-9 h-9 rounded-xl bg-white text-green-700 flex items-center justify-center shadow-sm">
                                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                                    </span>
                                    <span className="text-base font-semibold text-slate-700">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
