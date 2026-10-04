import { homeLog } from "./homeLog.js";

export function prefersReducedMotion() {
    try {
        return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
        return false;
    }
}

// Smooth scroll to a section by id. Logs a clear warning if the id does not exist.
export function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) {
        homeLog.warn(`scrollToId: no element with id "${id}" on the page.`);
        return;
    }
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

const LOADER_KEY = "ran_aswanu_home_loader_seen";

// The branded loader plays once per browser tab session, and never with reduced motion.
export function shouldShowLoader() {
    if (prefersReducedMotion()) return false;
    try {
        return sessionStorage.getItem(LOADER_KEY) !== "1";
    } catch {
        return false;
    }
}

export function markLoaderSeen() {
    try {
        sessionStorage.setItem(LOADER_KEY, "1");
    } catch {
        /* storage blocked: the loader may play again, nothing else is affected */
    }
}

export function formatLkr(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return n.toLocaleString("en-LK", { maximumFractionDigits: 2 });
}
