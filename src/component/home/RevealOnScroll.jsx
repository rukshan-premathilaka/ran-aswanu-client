import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./homeUtils.js";
import { homeLog } from "./homeLog.js";

function canAnimate() {
    return typeof window !== "undefined" && "IntersectionObserver" in window && !prefersReducedMotion();
}

// Fades/slides its children in when they scroll into view (one lightweight IntersectionObserver per block).
// variant "up" = fade + move up 30px. variant "image" = fade + scale 0.97 -> 1.
// delay = stagger in ms. Content is shown at once if animations are not possible or not wanted.
export default function RevealOnScroll({ as: Tag = "div", variant = "up", delay = 0, className = "", children, ...rest }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(() => !canAnimate());

    useEffect(() => {
        if (visible) return undefined;
        const el = ref.current;
        if (!el) return undefined;
        try {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        setVisible(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
            );
            observer.observe(el);
            return () => observer.disconnect();
        } catch (error) {
            homeLog.error("RevealOnScroll: could not observe element, showing it directly.", error);
            queueMicrotask(() => setVisible(true));
            return undefined;
        }
    }, [visible]);

    const base = variant === "image" ? "reveal-image" : "reveal";
    return (
        <Tag
            ref={ref}
            className={`${base} ${visible ? "is-visible" : ""} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
            {...rest}
        >
            {children}
        </Tag>
    );
}
