// Single place that reads environment variables (Vite exposes only names that start with VITE_).
// Local: put values in .env.local   |   Vercel: Project -> Settings -> Environment Variables
// NOTE: VITE_* values are bundled into the browser code. Never put secrets here.

const clean = (value) => (value || "").trim().replace(/\/+$/, "");

// Backend API root, WITH the /api part.  e.g. https://api.yourdomain.com/api
const RAW_API_URL = clean(import.meta.env.VITE_API_BASE_URL);

// Local development fallback only. A production build never falls back to localhost.
export const API_BASE_URL =
    RAW_API_URL || (import.meta.env.DEV ? "http://localhost:8080/api" : "");

if (!API_BASE_URL) {
    console.error("VITE_API_BASE_URL is not set. Add it in Vercel -> Settings -> Environment Variables and redeploy.");
}

// Backend root without /api. Used for images like  <root>/files/product-images/abc.jpg
export const FILES_BASE_URL =
    clean(import.meta.env.VITE_FILES_BASE_URL) || API_BASE_URL.replace(/\/api$/, "");

// Chat WebSocket (SockJS) address.
export const WS_URL =
    clean(import.meta.env.VITE_WS_URL) || `${FILES_BASE_URL}/ws/chat`;

// Turns "/files/x.png", "x.png" or a full http(s) link into a full image address (null when empty).
export function toFileUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return FILES_BASE_URL + (path.startsWith("/files/") ? path : "/files/" + path.replace(/^\/+/, ""));
}
