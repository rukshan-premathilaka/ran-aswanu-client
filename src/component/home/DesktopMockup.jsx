import { HOME_IMAGES } from "./homeConfig.js";
import DashboardMockup from "./DashboardMockup.jsx";
import ImageWithFallback from "./ImageWithFallback.jsx";

// Desktop window frame. Shows HOME_IMAGES.desktopScreenshot when set, otherwise the drawn dashboard.
export default function DesktopMockup() {
    const shot = HOME_IMAGES.desktopScreenshot;
    return (
        <div className="mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-100 px-4 py-3" aria-hidden="true">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-3 h-5 flex-1 max-w-[12rem] rounded-md bg-white/80" />
                </div>
                {shot ? (
                    <div className="aspect-[16/10]">
                        <ImageWithFallback src={shot} alt="Ran Aswanu desktop application" className="w-full h-full object-cover object-top" />
                    </div>
                ) : (
                    <div className="p-3" role="img" aria-label="Preview of the Ran Aswanu desktop application">
                        <DashboardMockup screenshot={null} />
                    </div>
                )}
            </div>
            <div className="mx-auto h-3 w-1/3 rounded-b-xl bg-slate-300" aria-hidden="true" />
            <div className="mx-auto h-1.5 w-1/2 rounded-b-xl bg-slate-200" aria-hidden="true" />
        </div>
    );
}
