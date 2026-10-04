import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import logoImg from "@/assets/farmerImg/logo.png";
import { BRAND_NAME } from "./homeConfig.js";

const SHOW_MS = 800; // short on purpose
const FADE_MS = 400;

// Short branded loader. Calls onFinish when it starts fading, so the hero animation can begin.
export default function HomeLoader({ onFinish }) {
    const [phase, setPhase] = useState("show"); // show -> leaving -> gone

    useEffect(() => {
        const leave = setTimeout(() => {
            setPhase("leaving");
            onFinish?.();
        }, SHOW_MS);
        const remove = setTimeout(() => setPhase("gone"), SHOW_MS + FADE_MS);
        return () => {
            clearTimeout(leave);
            clearTimeout(remove);
        };
    }, [onFinish]);

    if (phase === "gone") return null;

    return (
        <div
            className={`home-loader fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-5 ${phase === "leaving" ? "is-leaving" : ""}`}
            role="status"
            aria-live="polite"
        >
            <div className="relative">
                <img src={logoImg} alt={`${BRAND_NAME} logo`} className="w-20 h-20 object-contain" />
                <Leaf className="loader-leaf absolute -top-3 -right-3 w-7 h-7 text-green-600" aria-hidden="true" />
            </div>
            <div className="w-40 h-1.5 rounded-full bg-green-100 overflow-hidden">
                <div className="loader-bar h-full w-1/3 rounded-full bg-green-600" />
            </div>
            <p className="text-base font-medium text-slate-500">Loading...</p>
        </div>
    );
}
