import { useState } from "react";
import { ImageOff } from "lucide-react";
import { homeLog } from "./homeLog.js";

// Shows `src`; if it fails, tries `fallback`; if that fails too, shows a calm placeholder.
// Failures are written to the console so a broken link is easy to find.
export default function ImageWithFallback({ src, fallback, alt = "", className = "", eager = false, placeholderClassName = "" }) {
    const [stage, setStage] = useState(0); // 0 = src, 1 = fallback, 2 = placeholder
    const current = stage === 0 ? src : stage === 1 ? fallback : null;

    if (!current || stage > 1) {
        return (
            <div
                className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 text-green-600 ${placeholderClassName}`}
                role={alt ? "img" : undefined}
                aria-label={alt || undefined}
            >
                <ImageOff className="w-10 h-10 opacity-60" aria-hidden="true" />
            </div>
        );
    }

    return (
        <img
            src={current}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={() => {
                homeLog.warn(`Image failed to load (${stage === 0 ? "primary" : "fallback"}): ${String(current).slice(0, 120)}`);
                setStage((s) => s + 1);
            }}
            className={`zoom-img ${className}`}
        />
    );
}
