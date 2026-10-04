import { Sprout, Wallet, CloudSun, Wheat } from "lucide-react";
import { HOME_IMAGES } from "./homeConfig.js";
import ImageWithFallback from "./ImageWithFallback.jsx";

const TILES = [
    { icon: Sprout, label: "Crops" },
    { icon: Wheat, label: "Harvest" },
    { icon: Wallet, label: "Expenses" },
    { icon: CloudSun, label: "Weather" },
];
const BARS = [45, 70, 55, 85, 60, 95, 75];

// Drawn dashboard preview (decorative, no real numbers). If HOME_IMAGES.dashboardScreenshot is set,
// the real screenshot is shown instead.
export default function DashboardMockup({ screenshot = HOME_IMAGES.dashboardScreenshot, className = "" }) {
    if (screenshot) {
        return (
            <div className={`overflow-hidden rounded-2xl ${className}`}>
                <ImageWithFallback src={screenshot} alt="Ran Aswanu farm dashboard" className="w-full h-full object-cover" />
            </div>
        );
    }
    return (
        <div className={`flex gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4 ${className}`} aria-hidden="true">
            <div className="hidden sm:flex w-14 shrink-0 flex-col items-center gap-3 rounded-xl bg-green-700 py-4">
                <span className="w-7 h-7 rounded-lg bg-white/90" />
                {[0, 1, 2, 3].map((i) => <span key={i} className="w-7 h-7 rounded-lg bg-white/25" />)}
            </div>
            <div className="flex-1 min-w-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    {TILES.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm">
                            <span className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                                <Icon className="w-5 h-5" strokeWidth={1.75} />
                            </span>
                            <span className="text-sm font-semibold text-slate-700">{label}</span>
                        </div>
                    ))}
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-700">Farm performance</p>
                    <div className="mt-3 flex h-28 items-end gap-2">
                        {BARS.map((h, i) => (
                            <span key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-green-600 to-green-400" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
